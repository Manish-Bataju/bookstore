// Backend URL
const API_URL = 'http://localhost:5000/api/v1/products';

export const fetchAllProducts = async()=> {
 try{
    const response = await fetch(API_URL);
    if(!response.ok) throw new Error("Network response was not ok");

    const result = await response.json()
    return result.data || [];
 }catch(err){
console.error("Error Message:", err );
return [];
 }
}