import { useState, useEffect } from 'react';
import { Project } from '../types';
import { projectsService } from '../lib/projectsService';
import { uploadToCloudinary, deleteFromCloudinary } from '../lib/cloudinary';
import toast from 'react-hot-toast';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const fetchedProjects = await projectsService.getAllProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      toast.error('Failed to fetch projects');
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      const id = await projectsService.createProject(project);
      toast.success('Project added successfully');
      await fetchProjects();
      return id;
    } catch (error) {
      toast.error('Failed to add project');
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    try {
      await projectsService.updateProject(id, project);
      toast.success('Project updated successfully');
      await fetchProjects();
    } catch (error) {
      toast.error('Failed to update project');
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string, imagePublicId?: string, videoPublicId?: string) => {
    try {
      await projectsService.deleteProject(id);
      if (imagePublicId) {
        await deleteFromCloudinary(imagePublicId, 'image');
      }
      if (videoPublicId) {
        await deleteFromCloudinary(videoPublicId, 'video');
      }
      toast.success('Project deleted successfully');
      await fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  };
};