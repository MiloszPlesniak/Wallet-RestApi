const contactsPagimation = (data, page, limits) => {
  page = parseInt(page);
  limits = parseInt(limits);

  const startIndex = (page - 1) * limits;
  const endIndex = page * limits;

  return data.slice(startIndex, endIndex);
};

module.exports = contactsPagimation;
