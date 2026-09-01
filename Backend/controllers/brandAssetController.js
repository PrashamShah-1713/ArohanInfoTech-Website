const BrandAsset = require('../Models/BrandAsset');

async function getAllBrandAssets(req, res) {
  try {
    const query = {};
    if (req.query.page) query.page = req.query.page;
    if (req.query.type) query.type = req.query.type;
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    const assets = await BrandAsset.find(query).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: assets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to load brand assets' });
  }
}

async function getBrandAssetById(req, res) {
  try {
    const asset = await BrandAsset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Brand asset not found' });
    }
    res.json({ success: true, data: asset });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to fetch brand asset' });
  }
}

async function createBrandAsset(req, res) {
  try {
    const { name, type, imageUrl, altText, link, page, isActive, sortOrder } = req.body;

    if (!name || !type || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Name, type and image URL are required' });
    }

    const asset = await BrandAsset.create({
      name,
      type,
      imageUrl,
      altText: altText || name,
      link: link || '',
      page: page || 'portfolio',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
    });

    res.status(201).json({ success: true, data: asset, message: 'Brand asset created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to create brand asset' });
  }
}

async function updateBrandAsset(req, res) {
  try {
    const asset = await BrandAsset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!asset) {
      return res.status(404).json({ success: false, message: 'Brand asset not found' });
    }

    res.json({ success: true, data: asset, message: 'Brand asset updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to update brand asset' });
  }
}

async function deleteBrandAsset(req, res) {
  try {
    const asset = await BrandAsset.findByIdAndDelete(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Brand asset not found' });
    }

    res.json({ success: true, message: 'Brand asset deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to delete brand asset' });
  }
}

module.exports = {
  getAllBrandAssets,
  getBrandAssetById,
  createBrandAsset,
  updateBrandAsset,
  deleteBrandAsset,
};
