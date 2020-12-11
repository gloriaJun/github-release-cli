export function isObject(obj: unknown): boolean {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj) &&
    !(obj instanceof RegExp) &&
    !(obj instanceof Date)
  );
}

export const isEmpty = (str: string | undefined): boolean => {
  return !str || str.trim().length === 0;
};

export function isEmptyObject(obj: unknown): boolean {
  if (!isObject(obj)) {
    return false;
  }

  if (typeof obj === 'object') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
  }

  return true;
}

export const isNotEmpty = (str: string | undefined): boolean => {
  return !isEmpty(str);
};

export function isUndefined(obj: unknown): boolean {
  return typeof obj === 'undefined';
}

export function isUndefinedOrNull(obj: unknown): boolean {
  return isUndefined(obj) || obj === null;
}
