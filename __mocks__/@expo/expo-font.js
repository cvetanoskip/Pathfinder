export const loadAsync = jest.fn(() => Promise.resolve());
export const isLoaded = jest.fn(() => true);

export const Font = {
  isLoaded: () => true,
  loadAsync: jest.fn(() => Promise.resolve()),
};
