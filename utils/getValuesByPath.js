const getValueByPath = (obj, path) => {
  if (!path) return null;

  // If multiple possible paths
  if (Array.isArray(path)) {
    for (const p of path) {
      const value = getValueByPath(obj, p);
      if (value !== null && value !== undefined) return value;
    }
    return null;
  }

  return path.split(".").reduce((o, key) => o?.[key], obj);
};

module.exports = getValueByPath;
