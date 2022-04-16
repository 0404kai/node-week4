const handleErrorAsync = function handleErrorAsync(func) {
  // 先將原本的 async function 內容代進參數 func 儲存
  // middleware 先接住 router 資料
  return function (req, res, next) {
      //再執行函式，並增加 catch 條件去捕捉
      // async 本身就是 promise，所以可用 catch 去捕捉
      func(req, res, next).catch(
          function (error) {
              return next(error);
          }
      );
  };
};

module.exports = handleErrorAsync;