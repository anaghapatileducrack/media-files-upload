import {Schema} from 'mongoose';
import * as mongoose from 'mongoose';
const mediaSchema : Schema = new mongoose.Schema({
  
    data:{
     type:Object,
     required:true
     }
});
let MediaModel = mongoose.model('Media',mediaSchema);
export {MediaModel};