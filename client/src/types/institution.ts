export type Institution = {
  id: number;
  cityId: number;
  city: {
    id: number;
    name: string;
  };
  name: string;
};
