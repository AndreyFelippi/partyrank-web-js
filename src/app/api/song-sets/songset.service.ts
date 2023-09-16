import { prisma } from '../../lib/prisma';
import { convertDbSetToModel } from './songset.repository';

export class SongSetService {
  constructor() { }

  async create(data: SongSetPostData): Promise<SongSet> {
    try {
      const newSet = await prisma.songSet.create({
        data: {
          name: data.name,
          createdAt: new Date()
        }
      })

      return convertDbSetToModel(newSet);
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<SongSet[]> {
    try {
      const sets = await prisma.songSet.findMany({
        where: {
          deletedAt: null
        }
      });

      return sets.map(convertDbSetToModel);
    } catch (error) {
      throw error;
    }
  }

  async get(id: number): Promise<SongSet> {
    try {
      const set = await prisma.songSet.findUnique({
        include: {
          songs: true
        },
        where: {
          id: id,
          deletedAt: null
        }
      })
      if (set !== null) {
        return convertDbSetToModel(set)
      }else{
        throw new Error('Could not find Song Set')
      }
    } catch (error) {
      throw error;
    }
  }

  async update(data: SongSetPostData, id: number): Promise<SongSet> {
    try {
      const set = await prisma.songSet.update({
        where: {
          id: id
        },
        data: {
          name: data.name,
          updatedAt: new Date()
        }
      })

      return convertDbSetToModel(set);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      await prisma.songSet.update({
        where: {
          id: id
        },
        data: {
          deletedAt: new Date()
        }
      })
    } catch (error) {
      throw error;
    }
  }
}