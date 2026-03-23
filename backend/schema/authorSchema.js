import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    //the prefix like "Dr", "Sir", "Prof" optional
    title: {type:String, trim: true},
    fullName: {type: String, required:true, trim:true},
    bio: {type: String, required:true},
    profileImage: {type:String},
    website:{type: String, trim:true},
    socialLinks: [{
        platform: {type: String, required: true, enum:['Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'Threads', 'GoodReads', 'BookTok', 'YouTube']},
        url: {type:String, default: ""},
        icon:{type: String}
    }],
    awards:[{
        awardTitle: {type:String,required:true, trim:true},
        awardYear: {type:Number, min: 1900, max: 2100},
        status:{
            type: String,
            enum: ['Winner', 'Finalist', 'Shortlisted', 'Nominated'],
            default: "Winner"
        },

        //image of the award or Seal or Medal to display.
        awardLogo: {type: String, default:""},
        officialLink: {type: String}
    }],
    slug:{
        type: String, unique:true, index:true}
},{timestamps:true}); //added time Stamps for 'Created  at' and 'Added at'


authorSchema.pre('save', function(next){
    if(this.isModified('fullName')){
        //we will split fullname with spaces and then join them with underscore.
        this.slug=this.fullName.toLowerCase().trim().split(/\s+/).join("_").replace(/[^\w_]/g, '')
    }
    next();
});

export default mongoose.model('Author', authorSchema);