const fetchData=async (url,option={}) => {
    try {
        const res=await fetch(import.meta.env.VITE_BASE_URL+url,option)
        const data=await res.json()
        return data
    } catch (error) {
        return {success:false,message:'Connection Lost'}
    }
}
export default fetchData