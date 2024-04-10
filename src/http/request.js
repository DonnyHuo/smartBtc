const axios = require("axios");


// 发送 Axios 请求到 Subgraph 端点
const http = (url, subgraphQuery) => {
  // 在这里设置你的 Subgraph 查询头部信息（如果需要的话）
  const subgraphHeaders = {
    // 头部信息
  };
  // 构建 Axios 请求参数
  const requestOptions = {
    method: "post",
    url,
    headers: {
      "Content-Type": "application/json",
      ...subgraphHeaders,
    },
    data: {
      query: subgraphQuery,
    },
  };
  return new Promise((resolve, reject) => {
    axios(requestOptions)
      .then((response) => {
        const subgraphData = response.data.data;
        resolve(subgraphData);
      })
      .catch((reject) => {
        reject(reject);
      });
  });
};

export { http };
