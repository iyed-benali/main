import React,{useState,useEffect,} from 'react'
import Sidebar from '../Sidebar/Sidebar.jsx'
import Search from '../Search/Search.jsx'
import Items from '../itemsDisplay/items.jsx'
import Navbar from '../Navbar/Navbar.jsx'
import Slider from '../Slider/Slider.jsx'

import axios from 'axios'
import PriceFilter from './PriceFlter.jsx'

import { Link,useNavigate } from 'react-router-dom'
function HomePage() {
  const [data,setData]=useState([])
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const[theUser,setTheUser]=useState([])
  // const [view,setView]=useState('home')
  // const [item,setItem]=useState({})
  useEffect(()=>{
    if(localStorage.length>1){
    let email=JSON.parse(localStorage.user)
    axios.get(`http://localhost:3000/api/user/getUserId/${email.email}`)
    .then(res=>{
      console.log(res.data)
      setTheUser(res.data)
    })
    .catch(error=>{
      throw error
    })
  }
  else {
    <Link to='/Login'></Link>
  }
  },[])
  const navigate=useNavigate()
  
  useEffect(()=>{
    axios.get('http://localhost:3000/api/item')
    .then(res=>{
      setData(res.data)
    })
    .catch(error=>{
      throw error
    })
  },[])
  const filterCategories=(category)=>{
    const newItems=data.filter((item)=>(item.gategorie)===category)
    setData(newItems)
  }
  
  const filterItems = (namee) => {
    const newItems = data.filter(
      (item) =>
        item.title.toLowerCase().includes(namee.toLowerCase()) &&
        (minPrice === 0 || item.price >= minPrice) &&
        (maxPrice === 1000 || item.price <= maxPrice)
    );
    setData(newItems);
  };
 
  return (
     
    <div>
     <Slider data={data} />
    <Navbar  />
    <Search filterItems={filterItems} />
    <Sidebar filterCategories={filterCategories} />
     <Items  data={data}/>
    {/* <OneItemDisplay item={item} /> */}
      <button onClick={()=>{
navigate("/ImgUpload",{
  state:{
    theUser:theUser,
  }
  
      })}}>update my img</button>
 <PriceFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onApplyFilter={() => {
          filterItems('');
        }}/>
    </div>
    

    
  )
}

export default HomePage