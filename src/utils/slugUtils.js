// Generate slug with name + ID (Amazon style)
export const generateSlug = (name, id) => {
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