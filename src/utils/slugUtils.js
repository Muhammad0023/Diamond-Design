// Generate slug with name + ID 
export const generateSlug = (name, id) => {
  // Safety check: if name is undefined, null, or not a string
  if (!name || typeof name !== 'string') {
    console.warn('generateSlug: name is invalid, using id only');
    return id || 'product';
  }

  // Safety check: if id is undefined or null
  if (!id) {
    console.warn('generateSlug: id is missing');
    return name.toLowerCase().replace(/[^\w-]/g, '-');
  }

  const namePart = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return `${namePart}-${id}`;
};

// Example output:
// "Elegant White Kemis", "bRj6txqmCldP8RLyMSM2" 
// → "elegant-white-kemis-bRj6txqmCldP8RLyMSM2"