export const Asset = {
  fromModule: () => ({
    downloadAsync: jest.fn(() => Promise.resolve()),
  }),
};
