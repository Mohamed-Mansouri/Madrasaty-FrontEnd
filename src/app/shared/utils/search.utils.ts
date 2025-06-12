export const searchInObject = <T>(obj: T, searchTerm: string, fields: (keyof T)[]): boolean => {
  return fields.some(field => {
    const value = obj[field];
    return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
  });
};