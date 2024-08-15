import { IBoundedRange, RangeInternal, UniformRange } from "./range_type";

export interface LootTableType {
  pools: PollsTableType[];
}

export interface PollsTableType {
    rolls: UniformRange | number;
    weight?: number;
    entries: {
      item: string;
      weight: number;
      count?: UniformRange | number;
      setCanDestroy?: string[];
      setCanPlaceOn?: string[];
      setName?: string;
      setLore?: string[];
      setDurability?: UniformRange | number;
      setEnchantments?: {
        name: string;
        level: UniformRange | number;
      }[];
      setEnchantWithLevels?: {
        level: RangeInternal<1, 31> | IBoundedRange<1, 31>;
      };
    }[];
  }