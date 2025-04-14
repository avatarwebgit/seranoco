import { useQuery, useMutation } from '@tanstack/react-query';

const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

// get paginated products :/api/products-paginate?id=46&per_page=10&page=1

// header: /menus
// logo && footer :/information
// products search :/products/search?q={param}
// sliders : /sliders
// banner : /banner
// categories : /categories

//filter by shape ,shapes : /attribute/get/shape
//filter by shape ,sizes : /attribute/get/size
//filter by shape ,color : /attribute/get/colors
//filter by shape ,getproduct : /get/products

//details page ,getdetails :/get/product/${alias}
//get products by color : /get/ProductsByColor

//promotions : /promotions

// new products : /get/products/new?page=1&per_page=10
// new shapes : /attribute/get/new/shape
// new shapes by color : /attribute/get/new/color

export const getHeaderMenus = async lng => {
 const response = await fetch(`${baseUrl}/menus`, {
  method: 'GET',
  headers: {
   'Accept-Language': `${lng}`,
  },
 });
 const result = await response.json();
 return { response, result };
};

export const basicInformation = async lng => {
 const response = await fetch(`${baseUrl}/information`, {
  method: 'GET',
  headers: {
   'Accept-Language': `${lng}`,
  },
 });
 const result = await response.json();
 return { response, result };
};

export const sliderContents = async lng => {
 const response = await fetch(`${baseUrl}/sliders`, {
  method: 'GET',
  headers: {
   'Accept-Language': `${lng}`,
  },
 });
 const result = await response.json();
 return { response, result };
};

const fetchSearch = async param => {
 const response = await fetch(`${baseUrl}/products/search?q=${param}`);
 if (!response.ok) {
  throw new Error('Network response was not ok');
 }
 return response.json();
};

export const useSearch = param => {
 return useQuery({
  queryKey: ['search', param],
  queryFn: () => fetchSearch(param),
  enabled: !!param,
 });
};

export const usePages = () => {
 return useQuery({
  queryKey: ['pages'],
  queryFn: async () => {
   const response = await fetch(`${baseUrl}/pages`, {
    method: 'GET',
   });

   const result = await response.json();
   return result;
  },
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 1000,
  refetchOnWindowFocus: false,
 });
};

export const getNarrowBanners = async () => {
 const response = await fetch(`${baseUrl}/banners`, {
  method: 'GET',
 });
 const result = await response.json();
 return { response, result };
};

export const homePageCategories = async lng => {
 const response = await fetch(`${baseUrl}/categories`, {
  method: 'GET',
  headers: {
   'Accept-Language': `${lng}`,
  },
 });
 const result = await response.json();
 return { response, result };
};

export const getShapes = async () => {
 const response = await fetch(`${baseUrl}/attribute/get/shape`, {
  method: 'GET',
 });
 const result = await response.json();
 return { response, result };
};

export const getAllAtrributes = async (id, options) => {
 const response = await fetch(`${baseUrl}/attribute/get/size`, {
  method: 'POST',
  headers: {
   'Content-type': 'application/json',
  },

  body: JSON.stringify({ id }),
  ...options,
 });
 const result = await response.json();
 return { response, result };
};

export const getColors = async (shape_id, size_ids) => {
 const response = await fetch(`${baseUrl}/attribute/get/color`, {
  method: 'POST',
  headers: {
   'Content-type': 'application/json',
  },

  body: JSON.stringify({ shape_id, size_ids }),
 });
 const result = await response.json();
 return { response, result };
};

export const getNewColors = async (shape_id, size_ids) => {
 const response = await fetch(`${baseUrl}/attribute/get/new/color`, {
  method: 'POST',
  headers: {
   'Content-type': 'application/json',
  },
  body: JSON.stringify({ shape_id, size_ids }),
 });
 const result = await response.json();
 return { response, result };
};

export const getAllColors = async () => {
 const response = await fetch(`${baseUrl}/attribute/get/colors`, {
  method: 'GET',
  headers: {},
 });
 const result = await response.json();
 return { response, result };
};

export const getProduct = async (
 shape_id,
 size_ids,
 color_ids,
 page,
 per_page,
) => {
 const response = await fetch(
  `${baseUrl}/get/products?page=${page}&per_page=${per_page}`,
  {
   method: 'POST',
   headers: {
    'Content-type': 'application/json',
   },

   body: JSON.stringify({ shape_id, size_ids, color_ids }),
  },
 );
 const result = await response.json();
 return { response, result };
};

export const getPaginatedProductsByShape = async (id, page, per_page) => {
 const response = await fetch(
  `${baseUrl}/products-paginate?id=${id}&per_page=${per_page}&page=${page}`,
  {
   method: 'GET',
  },
 );
 const result = await response.json();
 return { response, result };
};

export const getProductDetails = async (alias, token) => {
 const response = await fetch(`${baseUrl}/get/product/${alias}`, {
  method: 'GET',
  headers: {
   Authorization: `bearer ${token}`,
  },
 });

 const result = await response.json();
 return { response, result };
};

export const getProductDetailsWithId = async (id, token) => {
 const response = await fetch(`${baseUrl}/get/variation/product/${id}`, {
  method: 'GET',
  headers: {
   Authorization: `bearer ${token}`,
  },
 });

 const result = await response.json();
 return { response, result };
};

export const getProductsByColor = async (
 color_ids,
 page,
 per_page,
 options,
) => {
 const response = await fetch(
  `${baseUrl}/get/ProductsByColor?page=${page}&per_page=${per_page}`,
  {
   method: 'POST',
   headers: {
    'Content-type': 'application/json',
   },

   body: JSON.stringify({ color_ids }),
   ...options,
  },
 );

 const result = await response.json();
 return { response, result };
};

export const getProductsByShape = async (
 shape_id,
 color_ids,
 page,
 per_page,
 options = {},
) => {
 const response = await fetch(
  `${baseUrl}/get/ProductsByColor?page=${page}&per_page=${per_page}`,
  {
   method: 'POST',
   headers: {
    'Content-type': 'application/json',
   },

   body: JSON.stringify({ color_ids, shape_id }),
   ...options,
  },
 );

 const result = await response.json();
 return { response, result };
};

export const getFilteredSizes = async (color_ids, shape_id, options = {}) => {
 const response = await fetch(`${baseUrl}/get/filterSizeByColor`, {
  method: 'POST',
  headers: {
   'Content-type': 'application/json',
  },

  body: JSON.stringify({ color_ids, shape_id }),
  ...options,
 });

 const result = await response.json();
 return { response, result };
};

export const getNewFilteredSizesByColor = async (color_ids, options = {}) => {
 const response = await fetch(`${baseUrl}/get/filterSizeNewByColor`, {
  method: 'POST',
  headers: {
   'Content-type': 'application/json',
  },

  body: JSON.stringify({ color_ids }),
  ...options,
 });

 const result = await response.json();
 return { response, result };
};

export const getCitiesByCountry = async (country_id, options) => {
 const response = await fetch(`${baseUrl}/get/cities/${country_id}`, {
  method: 'GET',
  headers: {},
  ...options,
 });
 const result = await response.json();
 return { response, result };
};

export const login = async (email, password, options) => {
 const response = await fetch(`${baseUrl}/login`, {
  method: 'POST',
  headers: {
   'Content-type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
  ...options,
 });
 const result = await response.json();
 return { response, result };
};

// Fetch Header Menus (GET)
export const useHeaderMenus = lng => {
 return useQuery({
  queryKey: ['menus', lng],
  queryFn: async () => {
   const response = await fetch(`${baseUrl}/menus`, {
    method: 'GET',
    headers: {
     'Accept-Language': lng,
    },
   });
   const result = await response.json();
   return result;
  },
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 10,
  refetchOnWindowFocus: false,
 });
};

export const sendRegistrationData = async data => {
 const response = await fetch(`${baseUrl}/register`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
   Accept: 'application/json',
  },
  body: JSON.stringify({ ...data }),
 });
 const result = await response.json();
 return { response, result };
};

// Fetch Basic Information (GET)
export const useBasicInformation = lng => {
 return useQuery({
  queryKey: ['information', lng],
  queryFn: async () => {
   const response = await fetch(`${baseUrl}/information`, {
    method: 'GET',
    headers: {
     'Accept-Language': lng,
    },
   });
   const result = await response.json();
   return result;
  },
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 10,
  refetchOnWindowFocus: false,
 });
};

// Fetch Slider Contents (GET)
export const useSliderContents = lng => {
 return useQuery({
  queryKey: ['sliders', lng],
  queryFn: async () => {
   const response = await fetch(`${baseUrl}/sliders`, {
    method: 'GET',
    headers: {
     'Accept-Language': lng,
    },
   });
   const result = await response.json();
   return result;
  },
 });
};

// Fetch Narrow Banners (GET)
export const useNarrowBanners = () => {
 return useQuery({
  queryKey: ['banners'],
  queryFn: async () => {
   const response = await fetch(`${baseUrl}/banners`, {
    method: 'GET',
   });
   const result = await response.json();
   return result;
  },
 });
};

// Fetch Categories (GET)
export const useHomePageCategories = lng => {
 return useQuery({
  queryKey: ['categories', lng],
  queryFn: async () => {
   const response = await fetch(`${baseUrl}/categories`, {
    method: 'GET',
    headers: {
     'Accept-Language': lng,
    },
   });
   const result = await response.json();
   return result;
  },
 });
};

// Fetch Shapes (GET)
export const useShapes = () => {
 return useQuery({
  queryKey: ['shapes'],
  queryFn: async () => {
   const response = await fetch(`${baseUrl}/attribute/get/shape`, {
    method: 'GET',
   });
   const result = await response.json();
   return result.data;
  },
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 10,
  refetchOnWindowFocus: false,
 });
};

// Fetch new added Shapes (GET)
export const useNewShapes = () => {
 return useQuery({
  queryKey: ['newshapes'],
  queryFn: async () => {
   const response = await fetch(`${baseUrl}/attribute/get/new/shape`, {
    method: 'GET',
   });
   const result = await response.json();
   return result.data;
  },
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 10,
  refetchOnWindowFocus: false,
 });
};

// Fetch Shapes Based on color id (GET)
export const useFilteredShapes = (color_ids, options) => {
 return useQuery({
  queryKey: ['FilteredShapes'],
  queryFn: async () => {
   const response = await fetch(`${baseUrl}/attribute/get/shape/with/color`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify({ color_ids }),
    ...options,
   });
   const result = await response.json();
   return result.data;
  },
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 10,
  refetchOnWindowFocus: false,
 });
};

// Fetch Sizes (POST)
export const useSizes = () => {
 return useMutation({
  mutationFn: async id => {
   const form = new FormData();
   form.append('id', id);
   const response = await fetch(`${baseUrl}/attribute/get/size`, {
    method: 'POST',
    body: form,
   });
   const result = await response.json();
   return result.data;
  },
 });
};

// Fetch Colors (POST)
export const useColors = () => {
 return useQuery({
  queryKey: ['AllColors'],
  queryFn: async () => {
   const response = await fetch(`${baseUrl}/attribute/get/colors`, {
    method: 'GET',
    headers: {},
   });

   if (!response.ok) {
    throw new Error('Failed to fetch colors');
   }

   const result = await response.json();
   return result;
  },
 });
};

// Fetch Products (POST)
export const useProducts = () => {
 return useMutation({
  mutationFn: async ({ shape_id, size_ids, color_ids }) => {
   const response = await fetch(`${baseUrl}/get/products`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify({ shape_id, size_ids, color_ids }),
   });
   const result = await response.json();
   return result;
  },
 });
};

// Fetch All Products by Shape (POST)
export const useAllProductsByShape = () => {
 return useMutation({
  mutationFn: async id => {
   const response = await fetch(`${baseUrl}/get/products`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
   });
   const result = await response.json();
   return result;
  },
 });
};

export const useAllCountries = () => {
 return useQuery({
  queryKey: ['allcountries'],
  queryFn: async () => {
   const response = await fetch(`${baseUrl}/get/countries`, {
    method: 'GET',
   });

   const result = await response.json();
   return result.data;
  },
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 10,
  refetchOnWindowFocus: false,
 });
};

export const useAllPromotions = () => {
 return useQuery({
  queryKey: ['allPromotions'],
  queryFn: async () => {
   const response = await fetch(`${baseUrl}/promotions`, {
    method: 'GET',
   });

   const result = await response.json();
   return result;
  },
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 10,
  refetchOnWindowFocus: false,
 });
};

export const useUser = token => {
 return useQuery({
  queryKey: ['user', token],
  queryFn: async () => {
   const response = await fetch(`${baseUrl}/user`, {
    headers: {
     Authorization: `bearer ${token}`,
    },
    method: 'GET',
   });

   const result = await response.json();
   return result;
  },
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 1000,
  refetchOnWindowFocus: false,
 });
};

export const getAllNewProducts = async (
 shape_id,
 color_ids,
 size_ids,
 page,
 per_page,
) => {
 const response = await fetch(
  `${baseUrl}/get/products/new?page=${page}&per_page=${per_page}`,
  {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
   },
   body: JSON.stringify({ shape_id, color_ids, size_ids }),
  },
 );
 const result = await response.json();
 return { response, result };
};

export const getPayments = async () => {
 const response = await fetch(`${baseUrl}/get/payments`, {
  method: 'GET',
 });
 const result = await response.json();
 return { response, result };
};

export const sendCartPrice = async (
 token,
 address_id,
 payment_method,
 amount,
) => {
 // console.log(token, address_id, payment_method, amount);
 const response = await fetch(`${baseUrl}/payment`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ address_id, payment_method, amount }),
 });
 const result = await response.json();
 return { response, result };
};

export const cartMehtodPayment = async () => {
 const response = await fetch(`${baseUrl}/get/payments`, {
  method: 'GET',
 });
 const result = await response.json();
 return { response, result };
};

export const updateUser = async token => {
 const response = await fetch(`${baseUrl}/update/user`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `bearer ${token}`,
  },
 });
 const result = await response.json();
 return { response, result };
};

export const addAddress = async (
 token,
 title,
 tel,
 address,
 city_id,
 postal_code,
) => {
 const response = await fetch(`${baseUrl}/add/user/address`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ title, tel, address, city_id, postal_code }),
 });
 const result = await response.json();
 return { response, result };
};

export const removeAddress = async (token, address_id) => {
 const response = await fetch(`${baseUrl}/remove/address/user`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ address_id }),
 });
 const result = await response.json();
 return { response, result };
};

export const getAllAddresses = async (token, options) => {
 const response = await fetch(`${baseUrl}/address`, {
  method: 'GET',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `Bearer ${token}`,
  },
  ...options,
 });
 const result = await response.json();
 return { response, result };
};

export const getAllFavorites = async token => {
 const response = await fetch(`${baseUrl}/favorites`, {
  headers: {
   Authorization: `bearer ${token}`,
  },
  method: 'GET',
 });

 const result = await response.json();
 return { response, result };
};

export const addToFavorite = async (token, alias, variation_id) => {
 const response = await fetch(`${baseUrl}/add/favorite/user`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `bearer ${token}`,
  },
  body: JSON.stringify({ alias, variation_id }),
 });
 const result = await response.json();
 return { response, result };
};

export const removeFromFavorite = async (token, variation_id) => {
 const response = await fetch(`${baseUrl}/favorite/remove/product/user`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `bearer ${token}`,
  },
  body: JSON.stringify({ variation_id: variation_id }),
 });
 const result = await response.json();
 return { response, result };
};

export const sendShoppingCart = async (
 token,
 product_id,
 variation_id,
 quantity,
) => {
 const response = await fetch(`${baseUrl}/cart`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `bearer ${token}`,
  },
  body: JSON.stringify({ product_id, variation_id, quantity }),
 });
 const result = await response.json();
 return { response, result };
};

export const getShoppingCart = async token => {
 const response = await fetch(`${baseUrl}/cart`, {
  method: 'GET',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `bearer ${token}`,
  },
 });
 const result = await response.json();
 return { response, result };
};

export const removeShoppingCart = async (token, cart_id) => {
 const response = await fetch(`${baseUrl}/cart/${cart_id}`, {
  method: 'DELETE',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `bearer ${token}`,
  },
 });
 const result = await response.json();
 return { response, result };
};

export const sendcardPaymentData = async (token, data, file, order_id) => {
 const formData = new FormData();

 if (typeof data === 'object' && data !== null) {
  for (const key in data) {
   if (data.hasOwnProperty(key)) {
    formData.append(key, data[key]);
   }
  }
 } else {
  formData.append('data', data);
 }

 formData.append('recScan', file);

 const response = await fetch(`${baseUrl}/order_cash2_submit/${order_id}`, {
  method: 'POST',
  headers: {
   Authorization: `bearer ${token}`,
  },
  body: formData,
 });

 const result = await response.json();
 return { response, result };
};

export const getAllProductFromCategory = async id => {
 const response = await fetch(`${baseUrl}/product_categories/${id}`, {
  method: 'GET',
  headers: {
   'Content-Type': 'application/json',
  },
 });
 const result = await response.json();
 return { response, result };
};

export const getUserTokenGoogle = async code => {
 const response = await fetch(`${baseUrl}/get-token-google`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({ token: code }),
 });
 const result = await response.json();
 return { response, result };
};

export const getAllArticles = async () => {
 const response = await fetch(`${baseUrl}/get/articles`, {
  method: 'GET',
 });
 const result = await response.json();
 return { response, result };
};

export const getSingleArticles = async alias => {
 const response = await fetch(`${baseUrl}/get/article/${alias}`, {
  method: 'GET',
 });
 const result = await response.json();
 return { response, result };
};

export const contactUsSend = async (name, email, message) => {
 const response = await fetch(`${baseUrl}/contact-us/send/request`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name, email, message }),
 });
 const result = await response.json();
 return { response, result };
};

export const getOrders = async token => {
 const response = await fetch(`${baseUrl}/orders`, {
  method: 'GET',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `bearer ${token}`,
  },
 });
 const result = await response.json();
 return { response, result };
};

export const getOrdersStatus = async token => {
 const response = await fetch(`${baseUrl}/orders/get/status`, {
  method: 'GET',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `bearer ${token}`,
  },
 });
 const result = await response.json();
 return { response, result };
};

export const getOrderByStatus = async (token, status) => {
 const response = await fetch(`${baseUrl}/orders/${status}`, {
  method: 'GET',
  headers: {
   Authorization: `bearer ${token}`,
  },
 });
 const result = await response.json();
 return { response, result };
};

export const getOrderStatusDetail = async (token, id) => {
 const response = await fetch(`${baseUrl}/order/${id}`, {
  method: 'GET',
  headers: {
   Authorization: `bearer ${token}`,
  },
 });
 const result = await response.json();
 return { response, result };
};

export const verifyOTP = async (otp, cellphone) => {
 console.log(otp, cellphone);
 const response = await fetch(`${baseUrl}/verify-otp`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({ otp, cellphone }),
 });
 const result = await response.json();
 return { response, result };
};

export const getAllTickets = async token => {
 const response = await fetch(`${baseUrl}/tickets`, {
  method: 'GET',
  headers: {
   Authorization: `bearer ${token}`,
  },
 });
 const result = await response.json();
 return { response, result };
};

export const sendTicket = async (token, subject, message, attachments) => {
 const response = await fetch(`${baseUrl}/tickets`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `bearer ${token}`,
  },
  body: JSON.stringify({ subject, message, attachments }),
 });
 const result = await response.json();
 return { response, result };
};

export const ticketDetail = async (token, id) => {
 const response = await fetch(`${baseUrl}/tickets/${id}`, {
  method: 'GET',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `bearer ${token}`,
  },
 });
 const result = await response.json();
 return { response, result };
};

export const replyTicket = async (token, ticket_id, message) => {
 const response = await fetch(`${baseUrl}/tickets/${ticket_id}/replies`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `bearer ${token}`,
  },
  body: JSON.stringify({ message }),
 });
 const result = await response.json();
 return { response, result };
};

export const getAdminCreatedPageDetails = async alias => {
 const response = await fetch(`${baseUrl}/page/${alias}`, {
  method: 'GET',
 });
 const result = await response.json();
 return { response, result };
};
