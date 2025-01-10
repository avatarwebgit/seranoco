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

export const getProductDetails = async alias => {
  const response = await fetch(`${baseUrl}/get/product/${alias}`, {
    method: 'GET',
  });

  const result = await response.json();
  return { response, result };
};

export const getProductDetailsWithId = async id => {
  const response = await fetch(`${baseUrl}/get/variation/product/${id}`, {
    method: 'GET',
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

export const getFilteredSizesByColor = async (color_ids, options = {}) => {
  const response = await fetch(`${baseUrl}/get/filterSizeByColor`, {
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
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
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

// Fetch Shapes Based on color id (GET)
export const useFilteredShapes = (color_ids, options) => {
  return useQuery({
    queryKey: ['FilteredShapes'],
    queryFn: async () => {
      const response = await fetch(
        `${baseUrl}/attribute/get/shape/with/color`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ color_ids }),
          ...options,
        },
      );
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
