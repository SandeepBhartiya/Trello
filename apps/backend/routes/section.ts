import  {Router} from "express";
import { authMiddleWare } from "../middleware/auth";
import { checkOrgAccess } from "../middleware/checkOrgAccess";
import { fromBoardId, fromSectionId } from "../middleware/resolver";
import {createSection, deleteSection, getSections, updateSections} from "../services/section";

const router=Router();

router.post("/",authMiddleWare,checkOrgAccess("member",fromBoardId),async(req,res)=>{
    try{
        const {boardId,title}=req.body;
        if(!title){
            return res.status(400).send("Title are required");
        }
        const section:any=await createSection(Number(boardId),title);
        if(section?.error){
            return res.status(400).send(section?.message);
        }
        return res.status(201).send("Section created successfully"); 
    }catch(err){
        console.log(err);
        return res.status(500).send("Failed to create section");
    }
});

router.get("/",authMiddleWare,checkOrgAccess("member",fromBoardId),async(req,res)=>{
    try{
        const {boardId}=req.query??req.params;
        const sections:any=await getSections(Number(boardId));
        if(sections?.error){
            return res.status(400).send(sections?.message);
        }
        return res.status(200).send(sections);
    }catch(err){
        console.log(err);
        return res.status(400).send("Failed to get sections");
    }
});

router.put("/:id",authMiddleWare,checkOrgAccess("member",fromSectionId),async(req,res)=>{
    try{
        const {id}=req.params;
        const {title}=req.body;
        if(!title){
            return res.status(400).send("Title are required");
        }
        const section:any=await updateSections(Number(id),title);
        if(section?.error){
            return res.status(400).send(section?.message);
        }
        return res.status(200).send(section);
    }catch(err){
        console.log(err);
        return res.status(400).send("Failed to update section");
    }
});

router.delete("/:id",authMiddleWare,checkOrgAccess("admin",fromSectionId),async(req,res)=>{
    try{
        const {id}=req.params;
        const section:any=await deleteSection(Number(id));
        if(section?.error){
            return res.status(400).send(section?.message);
        }
        return res.status(200).send(section);
    }catch(err){
        console.log(err);
        return res.status(400).send("Failed to delete section");
    }
})

export default router;