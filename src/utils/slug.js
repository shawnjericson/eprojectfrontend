// Utility functions for creating URL-friendly slugs

/**
 * Convert Vietnamese text to URL-friendly slug
 * @param {string} text - The text to convert
 * @returns {string} - URL-friendly slug
 */
export const createSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    // Replace Vietnamese characters
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'a')
    .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'e')
    .replace(/[ÌÍỊỈĨ]/g, 'i')
    .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'o')
    .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'u')
    .replace(/[ỲÝỴỶỸ]/g, 'y')
    .replace(/Đ/g, 'd')
    // Replace special characters and spaces
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Create a monument URL with slug
 * @param {number} id - Monument ID
 * @param {string} title - Monument title
 * @returns {string} - URL with slug
 */
export const createMonumentUrl = (id, title) => {
  const slug = createSlug(title);
  return `/monuments/${id}${slug ? `-${slug}` : ''}`;
};

/**
 * Extract ID from monument URL
 * @param {string} url - Monument URL with slug
 * @returns {number} - Monument ID
 */
export const extractIdFromUrl = (url) => {
  const match = url.match(/\/monuments\/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};
