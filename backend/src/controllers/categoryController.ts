import { Request, Response } from 'express';
import { memoryStore } from '../config/db';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    let categories = memoryStore.categories;

    if (typeof type === 'string' && (type === 'SAC' || type === 'CHAUSSURE')) {
      categories = categories.filter((c) => c.type === type);
    }

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error: any) {
    console.error('[category]', error);
    res.status(500).json({ success: false, message: 'Erreur interne.' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = memoryStore.categories.find((c) => c.slug === slug);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Catégorie introuvable.' });
    }

    res.json({ success: true, data: category });
  } catch (error: any) {
    console.error('[category]', error);
    res.status(500).json({ success: false, message: 'Erreur interne.' });
  }
};

