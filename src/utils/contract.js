import { ethers } from "ethers";

import store from "../store";

export const getBlockNumber = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return await provider.getBlockNumber();
};

export const getOkChainId = async () => {
  if (window.ethereum) {
    return (await window.ethereum.request({ method: "eth_chainId" })) == "0x38";
  }
};

export const getChainId = async () => {
  if (window.ethereum) {
    return await window.ethereum.request({ method: "eth_chainId" });
  }
};

export const connectWallet = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider
    .send("eth_requestAccounts", [])
    .catch((err) => {
      alert(err.info.error.message);
    });

  if (accounts) {
    store.commit("setAddress", accounts[0]);
  }
};

export const getBNBBalance = async (address) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  console.log("provider11111", provider);
  const balance = await provider.getBalance(address);
  console.log("balance", balance);
  const balanceInBNB = ethers.utils.formatEther(balance);
  return balanceInBNB;
};

/**
 * 读取合约方法
 * @param {*} contractAddress 合约地址
 * @param {*} abi 合约对应的 abi 文件
 * @param {*} funcName 调用的合约方法名
 * @param  {...any} params 传入的参数
 * @returns promise
 */
export function getContract(contractAddress, abi, funcName, ...params) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return new Promise((resolve, reject) => {
    contract[funcName](...params).then(
      (response) => {
        resolve(response);
      },
      (err) => {
        // 合约调用错误
        console.log(err);
        reject(605);
      }
    );
  });
}

/**
 * 写入合约方法
 * @param {*} contractAddress 合约地址
 * @param {*} abi 合约对应的 abi 文件
 * @param {*} funcName 调用的合约方法名
 * @param  {...any} params 传入的参数
 * @returns promise
 */
export function getWriteContract(contractAddress, abi, funcName, ...params) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const contractWithSigner = contract.connect(provider.getSigner());
  return new Promise((resolve, reject) => {
    contractWithSigner[funcName](...params).then(
      (response) => {
        resolve(response);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

/**
 * 读取合约方法（loading）
 * @param {*} contractAddress 合约地址
 * @param {*} abi 合约对应的 abi 文件
 * @param {*} funcName 调用的合约方法名
 * @param  {...any} params 传入的参数
 * @returns promise
 */
export function getContractLoad(contractAddress, abi, funcName, ...params) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return new Promise((resolve, reject) => {
    contract[funcName](...params).then(
      (response) => {
        let timer = setInterval(() => {
          provider
            .getTransactionReceipt(response.hash)
            .then((receipt) => {
              if (receipt) {
                if (receipt.logs.length) {
                  setTimeout(() => {
                    resolve(response);
                  }, 2000);
                } else {
                  // 链上交互失败
                  reject(601);
                }
                clearInterval(timer);
              }
            })
            .catch((err) => {
              // 合约链上交互方法调用错误
              console.log(err);
              reject(604);
            });
        }, 1000);
      },
      (err) => {
        // 合约调用错误
        console.log(err);
        reject(605);
      }
    );
  });
}

/**
 * 写入合约方法 (loading)
 * @param {*} contractAddress 合约地址
 * @param {*} abi 合约对应的 abi 文件
 * @param {*} funcName 调用的合约方法名
 * @param  {...any} params 传入的参数
 * @returns promise
 */
export function getWriteContractLoad(
  contractAddress,
  abi,
  funcName,
  ...params
) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const contractWithSigner = contract.connect(provider.getSigner());
  return new Promise((resolve, reject) => {
    contractWithSigner[funcName](...params).then(
      (response) => {
        let timer = setInterval(() => {
          provider
            .getTransactionReceipt(response.hash)
            .then((receipt) => {
              if (receipt) {
                if (receipt.status) {
                  setTimeout(() => {
                    resolve(response);
                  }, 2000);
                } else {
                  // 链上交互失败
                  reject(601);
                }
                clearInterval(timer);
              }
            })
            .catch((err) => {
              // 合约链上交互方法调用错误
              console.log(err);
              reject(604);
            });
        }, 1000);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
