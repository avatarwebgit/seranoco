const baseUrl = 'https://admin.seranoco.com/api';

// header: /menus
// logo && footer :/information
// products search :/products/search?q={param}
// sliders : /sliders
// categories : /categories

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
