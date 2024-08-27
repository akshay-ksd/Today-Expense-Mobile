import {create} from 'zustand'
const usePopup = create((set) => ({
    isPopup: false,
    
    setPopup: (value:any) => {
        if(value == false){
            set(() => ({isPopup: false}));
        }else{
            set((state:any) => ({isPopup: !state.isPopup}));
        }
    }
}));

export default usePopup;