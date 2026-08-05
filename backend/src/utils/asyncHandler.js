const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
}

export {asyncHandler}


// const asyncHandler = (fn) => (req, res, next) => {
//     try{
//         await fn(req, res, next)
//     }catch(err){
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message || "Internal Server Error"
//         })
//     }
// }  