import { supabase, isMockClient } from '../lib/supabaseClient';

// Static fallbacks for local mock dev server testing
const staticFarmers = [
  {
    id: 'aman-singh',
    name: 'Aman Singh',
    region: 'Punjab',
    quote: 'Cultivating premium basmati rice for generations.',
    image: '/images/Aman%20Singh.png',
    products: ['basmati-rice'],
  },
  {
    id: 'rashmi-barman',
    name: 'Rashmi Barman',
    region: 'Assam',
    quote: 'Tea farming is an art, passed down from my mother.',
    image: '/images/Rashmi%20Barman.png',
    products: ['assam-tea-leaves'],
  },
  {
    id: 'shantanu-patil',
    name: 'Shantanu Patil',
    region: 'Ratnagiri, Maharashtra',
    quote: 'Bringing the famed Alphonso mangoes to your table every summer.',
    image: '/images/Shantanu%20Patil.png',
    products: ['alphonso-mangoes', 'lemons'],
  },
  {
    id: 'mangesh-pawar',
    name: 'Mangesh Pawar',
    region: 'Nagpur, Maharashtra',
    quote: 'Fresh okra growers dedicated to quality and sustainability.',
    image: '/images/Mangesh%20Pawar.png',
    products: ['fresh-okra', 'brinjal'],
  },
  {
    id: 'aarthi-reddy',
    name: 'Aarthi Reddy',
    region: 'Warangal, Telangana',
    quote: 'Specializing in sun-dried spices from South India.',
    image: '/images/Aarthi%20reddy.png',
    products: ['coriander-seeds', 'fenugreek-seeds', 'toor-dal'],
  },
  {
    id: 'sukhdev-kaur',
    name: 'Sukhdev Kaur',
    region: 'Kapurthala, Punjab',
    quote: 'Spicy chilies and local pride—supporting my family farm.',
    image: '/images/Sukhdev%20Kaur.png',
    products: ['green-chillies'],
  },
  {
    id: 'rajesh-sharma',
    name: 'Rajesh Sharma',
    region: 'Bihar',
    quote: 'Proudly growing fresh sugarcane for over two decades.',
    image: '/images/Rajesh%20Sharma.png',
    products: ['red-onions', 'rajma-beans', 'sugarcane'],
  },
  {
    id: 'meena-kumari',
    name: 'Meena Kumari',
    region: 'Tamil Nadu',
    quote: 'Bringing farm-fresh tomatoes straight from our fields.',
    image: '/images/Meena%20Kumari.png',
    products: ['tomatoes', 'red-carrots'],
  },
  {
    id: 'prakash-iyer',
    name: 'Prakash Iyer',
    region: 'Kerala',
    quote: 'Supplying tender coconuts and organic bananas.',
    image: '/images/Prakash%20Iyer.png',
    products: ['bengal-jaggery', 'fresh-bananas', 'papaya'],
  },
  {
    id: 'anita-desai',
    name: 'Anita Desai',
    region: 'Gujarat',
    quote: 'Expert in growing groundnuts with sustainable practices.',
    image: '/images/Anita%20Desai.png',
    products: ['turmeric-powder'],
  },
  {
    id: 'suresh-verma',
    name: 'Suresh Verma',
    region: 'Rajasthan',
    quote: 'Cultivating millet and bajra for healthy living.',
    image: '/images/Suresh%20Verma.png',
    products: ['sweet-corn', 'raw-peas', 'potatoes'],
  },
  {
    id: 'kavita-joshi',
    name: 'Kavita Joshi',
    region: 'Madhya Pradesh',
    quote: 'Dedicated to growing organic wheat and pulses.',
    image: '/images/Kavita%20Joshi.png',
    products: ['organic-wheat', 'pumpkins', 'moong-dal', 'urad-dal'],
  },
  {
    id: 'harish-kumar',
    name: 'Harish Kumar',
    region: 'Karnataka',
    quote: 'Specializing in fresh green beans and seasonal vegetables.',
    image: '/images/Harish%20kumar.jpg',
    products: ['cabbage', 'spinach'],
  },
  {
    id: 'pooja-nair',
    name: 'Pooja Nair',
    region: 'Kerala',
    quote: 'Producer of high-quality black pepper and cardamom.',
    image: '/images/Pooja%20Nair.png',
    products: ['coconut-oil'],
  },
  {
    id: 'deepak-yadav',
    name: 'Deepak Yadav',
    region: 'Uttar Pradesh',
    quote: 'Known for nutritious chickpeas and lentils.',
    image: '/images/Deepak%20Yadav.png',
    products: ['kashmiri-apples', 'green-grapes', 'chickpeas'],
  },
];

export const villageHeads = [
  {
    id: 'sunita-devi',
    name: 'Sunita Devi',
    village: 'Erode District, Tamil Nadu',
    role: 'Oversees spice cultivation, quality inspection, and local logistics for South India.',
    image: '/images/Anita%20Desai.png',
  },
  {
    id: 'mehul-singh',
    name: 'Mehul Singh',
    village: 'Varanasi District, Uttar Pradesh',
    role: 'Coordinates vegetable listings and ensures fair crop pricing for local farmers.',
    image: '/images/Deepak%20Yadav.png',
  },
  {
    id: 'rajendra-kumar',
    name: 'Rajendra Kumar',
    village: 'Amritsar District, Punjab',
    role: 'Oversees rice and wheat farmer listings, quality verification, and regional logistics.',
    image: '/images/Rajesh%20Sharma.png',
  },
  {
    id: 'priya-das',
    name: 'Priya Das',
    village: 'Jorhat, Assam',
    role: 'Manages tea garden listings and ensures fair pricing for small-scale tea farmers.',
    image: '/images/Kavita%20Joshi.png',
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
