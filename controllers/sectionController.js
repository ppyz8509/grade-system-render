const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createSection = async (req, res) => {
  try {
    const { sec_name, major_id } = req.body;
    
    if (!sec_name || !major_id) {
      return res.status(400).json({ message: 'Section name and major_id are required' });
    }
    
    const section = await prisma.section.create({
      data: {
        sec_name,
        major_id,
      },
    });
    res.status(201).json(section);
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getSections = async (req, res) => {
  try {
    const sections = await prisma.section.findMany();
    res.status(200).json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error); 
    res.status(500).json({ error: error.message });
  }
};

exports.getSectionById = async (req, res) => {
  try {
    const { sec_id } = req.params;
    
    if (isNaN(sec_id)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    
    const section = await prisma.section.findUnique({
      where: { sec_id: Number(sec_id) },
    });
    
    if (section) {
      res.status(200).json(section);
    } else {
      res.status(404).json({ message: 'Section not found' });
    }
  } catch (error) {
    console.error('Error fetching section by ID:', error); 
    res.status(500).json({ error: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sec_id } = req.params;
    const { sec_name, major_id } = req.body;
    
    if (isNaN(sec_id)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    if (!sec_name || !major_id) {
      return res.status(400).json({ message: 'Section name and major_id are required' });
    }
    
    const section = await prisma.section.update({
      where: { sec_id: Number(sec_id) },
      data: {
        sec_name,
        major_id,
      },
    });
    res.status(200).json(section);
  } catch (error) {
    console.error('Error updating section:', error); 
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: 'Section not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { sec_id } = req.params;
    
    if (isNaN(sec_id)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    
    const section = await prisma.section.delete({
      where: { sec_id: Number(sec_id) },
    });
    res.status(200).json(section);
  } catch (error) {
    console.error('Error deleting section:', error); 
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: 'Section not found' });
    }
    res.status(500).json({ error: error.message });
  }
};
