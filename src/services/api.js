const baseUrl = 'https://admin.seranoco.com/api';

// header: /menus
// logo && footer :/information
// products search :/products/search?q={param}
// sliders : /sliders
// banner : /banner
// categories : /categories

//filter by shape ,shapes : /attribute/get/shape
//filter by shape ,sizes : /attribute/get/size
//filter by shape ,color : /attribute/get/colors
//filter by shape ,getproduct :/get/products

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

export const getSizes = async id => {
  const form = new FormData();
  form.append('id', id);
  const response = await fetch(`${baseUrl}/attribute/get/size`, {
    method: 'POST',
    body: form,
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

export const getProduct = async (shape_id, size_ids, color_ids) => {
  console.log(shape_id, size_ids, color_ids);
  const response = await fetch(`${baseUrl}/get/products`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ shape_id, size_ids, color_ids }),
  });
  const result = await response.json();
  return { response, result };
};
