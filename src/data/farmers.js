import { supabase, isMockClient } from '../lib/supabaseClient';

// Static fallbacks for local mock dev server testing
const staticFarmers = [
  {
    id: 'aman-singh',
    name: 'Aman Singh',
    region: 'Punjab',
    quote: 'Cultivating premium basmati rice for generations.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Aman%20Singh.png',
    products: ['basmati-rice'],
  },
  {
    id: 'rashmi-barman',
    name: 'Rashmi Barman',
    region: 'Assam',
    quote: 'Tea farming is an art, passed down from my mother.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Rashmi%20Barman.png',
    products: ['assam-tea-leaves'],
  },
  {
    id: 'shantanu-patil',
    name: 'Shantanu Patil',
    region: 'Ratnagiri, Maharashtra',
    quote: 'Bringing the famed Alphonso mangoes to your table every summer.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Shantanu%20Patil.png',
    products: ['alphonso-mangoes'],
  },
  {
    id: 'mangesh-pawar',
    name: 'Mangesh Pawar',
    region: 'Nagpur, Maharashtra',
    quote: 'Fresh okra growers dedicated to quality and sustainability.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Mangesh%20Pawar.png',
    products: ['fresh-okra'],
  },
  {
    id: 'aarthi-reddy',
    name: 'Aarthi Reddy',
    region: 'Warangal, Telangana',
    quote: 'Specializing in sun-dried spices from South India.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Aarthi%20reddy.png',
    products: ['coriander-seeds'],
  },
  {
    id: 'sukhdev-kaur',
    name: 'Sukhdev Kaur',
    region: 'Kapurthala, Punjab',
    quote: 'Spicy chilies and local pride—supporting my family farm.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Sukhdev%20Kaur.png',
    products: ['green-chillies'],
  },
  {
    id: 'rajesh-sharma',
    name: 'Rajesh Sharma',
    region: 'Bihar',
    quote: 'Proudly growing fresh sugarcane for over two decades.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Rajesh%20Sharma.png',
    products: ['red-onions'],
  },
  {
    id: 'meena-kumari',
    name: 'Meena Kumari',
    region: 'Tamil Nadu',
    quote: 'Bringing farm-fresh tomatoes straight from our fields.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Meena%20Kumari.png',
    products: ['tomatoes'],
  },
  {
    id: 'prakash-iyer',
    name: 'Prakash Iyer',
    region: 'Kerala',
    quote: 'Supplying tender coconuts and organic bananas.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Prakash%20Iyer.png',
    products: ['bengal-jaggery'],
  },
  {
    id: 'anita-desai',
    name: 'Anita Desai',
    region: 'Gujarat',
    quote: 'Expert in growing groundnuts with sustainable practices.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Anita%20Desai.png',
    products: ['turmeric-powder'],
  },
  {
    id: 'suresh-verma',
    name: 'Suresh Verma',
    region: 'Rajasthan',
    quote: 'Cultivating millet and bajra for healthy living.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Suresh%20Verma.png',
    products: ['sweet-corn'],
  },
  {
    id: 'kavita-joshi',
    name: 'Kavita Joshi',
    region: 'Madhya Pradesh',
    quote: 'Dedicated to growing organic wheat and pulses.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Kavita%20Joshi.png',
    products: ['organic-wheat', 'pumpkins'],
  },
  {
    id: 'harish-kumar',
    name: 'Harish Kumar',
    region: 'Karnataka',
    quote: 'Specializing in fresh green beans and seasonal vegetables.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Harish%20kumar.jpg',
    products: ['fresh-okra'],
  },
  {
    id: 'pooja-nair',
    name: 'Pooja Nair',
    region: 'Kerala',
    quote: 'Producer of high-quality black pepper and cardamom.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Pooja%20Nair.png',
    products: ['coconut-oil'],
  },
  {
    id: 'deepak-yadav',
    name: 'Deepak Yadav',
    region: 'Uttar Pradesh',
    quote: 'Known for nutritious chickpeas and lentils.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Deepak%20Yadav.png',
    products: ['kashmiri-apples'],
  },
];

export const villageHeads = [
  {
    id: 'sunita-devi',
    name: 'Sunita Devi',
    village: 'Erode District, Tamil Nadu',
    role: 'Oversees spice cultivation, quality inspection, and local logistics for South India.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Anita%20Desai.png',
  },
  {
    id: 'mehul-singh',
    name: 'Mehul Singh',
    village: 'Varanasi District, Uttar Pradesh',
    role: 'Coordinates vegetable listings and ensures fair crop pricing for local farmers.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Deepak%20Yadav.png',
  },
  {
    id: 'rajendra-kumar',
    name: 'Rajendra Kumar',
    village: 'Amritsar District, Punjab',
    role: 'Oversees rice and wheat farmer listings, quality verification, and regional logistics.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Rajesh%20Sharma.png',
  },
  {
    id: 'priya-das',
    name: 'Priya Das',
    village: 'Jorhat, Assam',
    role: 'Manages tea garden listings and ensures fair pricing for small-scale tea farmers.',
    image: 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Kavita%20Joshi.png',
  },
];

// Asynchronous fetch wrapper to retrieve farmers from the database (or fallback locally)
export const getFarmers = async () => {
  if (isMockClient) {
    return { data: staticFarmers, error: null };
  }
  const { data, error } = await supabase.from('farmers').select('*');
  return { data, error };
};

export default staticFarmers;
