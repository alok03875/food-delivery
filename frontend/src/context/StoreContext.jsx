import axios from "axios";
import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets";

export const StoreContext = createContext(null)

// ------------------------------------------------------------------------------------------------------------
const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [food_list, setFood_List] = useState([])

    const addToCart = async (itemId) => {
        if(!cartItems[itemId]) {
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else {
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
        if (token) {
            await axios.post(url+"/api/cart/add", {itemId}, {headers:{token}});
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]-1 }));
        if (token) {
            await axios.post(url+"/api/cart/remove", {itemId}, {headers:{token}});
        }
    }

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // const getTotalCartAmount = () => {
    //     let totalAmount = 0;
    //     for(const item in cartItems) {
    //         if(cartItems[item] > 0) {
    //             let itemInfo = food_list.find((product) => product._id === item);
    //             console.log(itemInfo)
               // totalAmount += itemInfo.price * cartItems[item]
    //         }
    //     }
    //     return totalAmount;
    // }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
    
        // Assuming cartItems is an object where the keys are item IDs and values are quantities
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                // Find the product in food_list by its ID
                const itemInfo = food_list.find((product) => product._id.toString() === itemId.toString());
                
                // Log for debugging if itemInfo is undefined
                if (!itemInfo) {
                    console.error(`Item with ID ${itemId} not found in food_list`);
                    continue;  // Skip this item and continue to the next one
                }
    
                // Safely access itemInfo.price if itemInfo exists
                totalAmount += itemInfo.price * cartItems[itemId];
            }
        }
    
        return totalAmount;
    };
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++    

    // fetch food list from data base
    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setFood_List(response.data.message)
    }

    // to add quantity
    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get", {}, {headers:{token}});
        setCartItems(response.data.cartData);    // setCartItems(response.data.cartData)
    }

    // after refresh the page we logout. to fix this ----
    useEffect(()=>{
        async function loadData() {
            await fetchFoodList()
            if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider