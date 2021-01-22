import {Schema} from 'mongoose';
import * as mongoose from 'mongoose';
const productSchema : Schema = new mongoose.Schema({
  
    data:{
     type:Object,
     required:true
     }
});
let ProductModel = mongoose.model('Product',productSchema);
export {ProductModel};