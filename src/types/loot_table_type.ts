import { IBoundedRange, RangeInternal, UniformRange } from "./range_type";

export interface LootTableContent {
  pools: PollsTableContent[];
}

export interface EntryContent {
  item: string;
  weight: number;
  count?: UniformRange | number;
  toEntity?: string;
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
}

export interface PollsTableContent {
    rolls: UniformRange | number;
    weight?: number;
    entries: EntryContent[];
  }