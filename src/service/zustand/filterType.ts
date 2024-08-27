import { create } from 'zustand'
const useFilterType = create((set) => ({
    filterType: "Daily",

    setFilterType: (value: any) => {
        set(() => ({ filterType: value }));
    }
}));

export default useFilterType;