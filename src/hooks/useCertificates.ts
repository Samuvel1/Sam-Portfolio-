import { useState, useEffect } from 'react';
import { Certificate } from '../types';
import { certificatesService } from '../lib/certificatesService';
import { deleteFromCloudinary } from '../lib/cloudinary';
import toast from 'react-hot-toast';

export const useCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      const fetchedCertificates = await certificatesService.getAllCertificates();
      setCertificates(fetchedCertificates);
    } catch (error) {
      toast.error('Failed to fetch certificates');
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCertificate = async (certificate: Omit<Certificate, 'id' | 'createdAt'>) => {
    try {
      const id = await certificatesService.createCertificate(certificate);
      toast.success('Certificate added successfully');
      await fetchCertificates();
      return id;
    } catch (error) {
      toast.error('Failed to add certificate');
      console.error('Error adding certificate:', error);
      throw error;
    }
  };

  const updateCertificate = async (id: string, certificate: Partial<Certificate>) => {
    try {
      await certificatesService.updateCertificate(id, certificate);
      toast.success('Certificate updated successfully');
      await fetchCertificates();
    } catch (error) {
      toast.error('Failed to update certificate');
      console.error('Error updating certificate:', error);
      throw error;
    }
  };

  const deleteCertificate = async (id: string, imagePublicId?: string) => {
    try {
      await certificatesService.deleteCertificate(id);
      if (imagePublicId) {
        await deleteFromCloudinary(imagePublicId, 'image');
      }
      toast.success('Certificate deleted successfully');
      await fetchCertificates();
    } catch (error) {
      toast.error('Failed to delete certificate');
      console.error('Error deleting certificate:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return {
    certificates,
    loading,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    refetch: fetchCertificates
  };
};
