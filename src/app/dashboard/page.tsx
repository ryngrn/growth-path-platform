'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/card';
import { RandomQuote } from '@/components/random-quote';
import Image from 'next/image';
import { Dialog, DialogContent, IconButton, TextField, MenuItem, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Player } from '@lottiefiles/react-lottie-player';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface Child {
  _id: string;
  name: string;
  gender: string;
  birthday: string;
  paths: any[];
  skills: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [showAddChild, setShowAddChild] = useState(false);
  const [childForm, setChildForm] = useState({ name: '', gender: '', birthday: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [isRemovingChild, setIsRemovingChild] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    } else if (status === 'authenticated') {
      fetchChildren();
    }
  }, [status, router]);

  const fetchChildren = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/user/children');
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          setChildren(data.children || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch children:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (child: Child) => {
    setEditingChild(child);
    setChildForm({
      name: child.name,
      gender: child.gender || '',
      birthday: new Date(child.birthday).toISOString().split('T')[0],
    });
    setShowAddChild(true);
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const url = editingChild 
        ? `/api/user/children/${editingChild._id}`
        : '/api/user/children';
      
      const method = editingChild ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(childForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Failed to ${editingChild ? 'update' : 'add'} child`);
      }

      setSuccess(`Child ${editingChild ? 'updated' : 'added'} successfully!`);
      setShowAddChild(false);
      setEditingChild(null);
      setChildForm({ name: '', gender: '', birthday: '' });
      await fetchChildren();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const toggleCard = (childId: string) => {
    setExpandedCard(expandedCard === childId ? null : childId);
    setDeleteError(null);
  };

  const handleDeleteClick = (childId: string, childName: string) => {
    setShowDeleteConfirm(childId);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async (childId: string) => {
    try {
      setDeleteError(null);
      const res = await fetch('/api/user/children', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete child');
      }

      // Refresh the children list
      await fetchChildren();
      setShowDeleteConfirm(null);
      setExpandedCard(null);
    } catch (err: any) {
      console.error('Delete child error:', err);
      setDeleteError(err.message || 'Failed to delete child. Please try again.');
    }
  };

  const handleRemoveClick = (child: Child) => {
    setEditingChild(child);
    setIsRemovingChild(true);
    setShowAddChild(true);
  };

  const handleCancelRemove = () => {
    setIsRemovingChild(false);
    setEditingChild(null);
    setShowAddChild(false);
  };

  const handleConfirmRemove = async () => {
    if (!editingChild) return;
    try {
      setDeleteError(null);
      const res = await fetch('/api/user/children', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: editingChild._id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete child');
      }

      await fetchChildren();
      setIsRemovingChild(false);
      setEditingChild(null);
      setShowAddChild(false);
    } catch (err: any) {
      console.error('Delete child error:', err);
      setDeleteError(err.message || 'Failed to delete child. Please try again.');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl max-h-[812px] overflow-y-auto">
        <div className="mb-8">
          {children && children.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-[#141313]">Your Children</h2>
              <button
                className="p-2 text-white font-semibold shadow-sm transition hover:shadow-lg flex items-center justify-center"
                style={{ backgroundColor: '#ef5e2f', borderRadius: '100px' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f1784f')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#ef5e2f')}
                onClick={() => setShowAddChild(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </button>
            </div>
          )}
          
          {success && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-out my-[200px]">
              {success}
            </div>
          )}

          {children && children.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {children.map((child) => (
                <Card key={child._id} className="w-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-[#141313]">{child.name}</h3>
                      <p className="text-gray-600">{calculateAge(child.birthday)} years old</p>
                    </div>
                    <button
                      onClick={() => handleEditClick(child)}
                      className="p-2 text-gray-600 hover:text-[#ef5e2f] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-4">
                    {child.paths?.length > 0 ? (
                      <>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Enrolled in {child.paths.length} Learning Paths</span>
                          <span>0%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#ef5e2f] h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        {child.skills?.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm text-gray-600">Recent Accomplishments</p>
                            <div className="space-y-2">
                              {child.skills.slice(-3).map((skill, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div className="w-2 h-2 rounded-full bg-[#ef5e2f]" />
                                  <p className="text-sm text-gray-700">{skill.name}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <button 
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-[#ef5e2f] hover:text-[#ef5e2f] transition-colors"
                        onClick={() => {/* TODO: Add navigation to learning paths */}}
                      >
                        + Add a Learning Path
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-6">
                <Image
                  src="/images/kids-learning.svg"
                  alt="Kids Learning"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Children Added Yet</h3>
              <p className="text-gray-600 mb-6">Start by adding your first child to track their learning journey.</p>
              <button
                onClick={() => setShowAddChild(true)}
                className="px-6 py-2 bg-[#ef5e2f] text-white rounded-full hover:bg-[#f1784f] transition-colors"
              >
                Add a Child
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Slide-up overlay for Add/Edit Child */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          showAddChild ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } z-[1000000]`}
        onClick={() => {
          setShowAddChild(false);
          setEditingChild(null);
          setChildForm({ name: '', gender: '', birthday: '' });
          setError('');
        }}
      >
        <div 
          className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl transition-transform duration-300 transform ${
            showAddChild ? 'translate-y-0' : 'translate-y-full'
          } max-w-[390px] mx-auto z-[1000001] min-h-[90vh] flex flex-col`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 flex-1">
            {isRemovingChild ? (
              <div className="flex flex-col h-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                  Remove Child
                </h2>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-48 h-48 mb-8">
                    <DotLottieReact
                      src="https://lottie.host/ff771b03-6fc3-430c-a800-0c803259a02b/ILL4yqla97.lottie"
                      loop
                      autoplay
                    />
                  </div>
                  <p className="text-center text-gray-700 text-lg">
                    Are you sure you want to remove <span className="font-bold">{editingChild?.name}</span>? All learning path progress will be lost forever!
                  </p>
                </div>
                {deleteError && <p className="text-red-500 text-sm text-center mb-4">{deleteError}</p>}
                <div className="flex flex-col space-y-4 mt-[40px]">
                  <button
                    type="button"
                    onClick={handleConfirmRemove}
                    className="w-full py-3 px-6 rounded-[100px] bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                  >
                    Yes, remove {editingChild?.name}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelRemove}
                    className="w-full py-3 px-6 rounded-[100px] border border-gray-300 text-gray-700 font-semibold hover:border-[#ef5e2f] hover:text-[#ef5e2f] transition-colors"
                  >
                    No, go back
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                  {editingChild ? 'Edit Child' : 'Add a Child'}
                </h2>

                <form onSubmit={handleAddChild} className="space-y-[60px]">
                  <TextField
                    fullWidth
                    label="Child's Name"
                    value={childForm.name}
                    onChange={(e) => setChildForm({ ...childForm, name: e.target.value })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setChildForm({ ...childForm, gender: 'female' })}
                        className={`flex-1 py-2 px-4 rounded-md border ${
                          childForm.gender === 'female'
                            ? 'bg-[#EF4136] text-white border-[#EF4136]'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Female
                      </button>
                      <button
                        type="button"
                        onClick={() => setChildForm({ ...childForm, gender: 'male' })}
                        className={`flex-1 py-2 px-4 rounded-md border ${
                          childForm.gender === 'male'
                            ? 'bg-[#EF4136] text-white border-[#EF4136]'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setChildForm({ ...childForm, gender: 'other' })}
                        className={`flex-1 py-2 px-4 rounded-md border ${
                          childForm.gender === 'other'
                            ? 'bg-[#EF4136] text-white border-[#EF4136]'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Other
                      </button>
                    </div>
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      type="date"
                      label="Birthday"
                      value={childForm.birthday}
                      onChange={(e) => setChildForm({ ...childForm, birthday: e.target.value })}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                    {editingChild && (
                      <button
                        type="button"
                        onClick={() => handleRemoveClick(editingChild)}
                        className="text-red-500 text-base font-bold mt-[60px] hover:text-red-600 transition-colors"
                      >
                        Remove Child
                      </button>
                    )}
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>
              </>
            )}
          </div>
          {!isRemovingChild && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleAddChild}
                  className="w-full py-3 px-6 rounded-[100px] bg-[#ef5e2f] text-white font-semibold hover:bg-[#f1784f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : editingChild ? 'Update Child' : 'Add Child'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddChild(false);
                    setEditingChild(null);
                    setChildForm({ name: '', gender: '', birthday: '' });
                    setError('');
                  }}
                  className="w-full py-3 px-6 rounded-[100px] border border-gray-300 text-gray-700 font-semibold hover:border-[#ef5e2f] hover:text-[#ef5e2f] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)}>
        <DialogContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Remove Child</h3>
            <p className="text-xl mb-6">
              Are you sure you want to remove <span className="font-bold">{children.find(c => c._id === showDeleteConfirm)?.name}</span>? You'll lose all learning progress and it can't be recovered.
            </p>
            {deleteError && (
              <p className="text-red-500 mb-4">{deleteError}</p>
            )}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => setShowDeleteConfirm(null)}
                variant="outlined"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={() => showDeleteConfirm && handleDeleteConfirm(showDeleteConfirm)}
                variant="contained"
                style={{ backgroundColor: '#ef5e2f' }}
                className="hover:bg-[#f1784f]"
              >
                Remove
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 