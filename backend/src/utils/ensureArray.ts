function ensureArray<T>(objectOrArray?: T | T[]): T[] {
  if (!objectOrArray) {
    return [];
  }

  if (!Array.isArray(objectOrArray)) {
    return [objectOrArray];
  }

  return objectOrArray;
}

export default ensureArray;
