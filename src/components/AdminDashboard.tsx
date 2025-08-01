import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Calendar,
  Users,
  Mail,
  Phone,
  Image,
  X,
  ChevronLeft,
  ChevronRight,
  Lock
} from 'lucide-react';

interface ContentData {
  home: {
    summary: string;
  };
  menus: Array<{
    id: string;
    date: string;
    title: string;
    pricePerPerson: number;
    maxPersons: number;
    childrenAllowed: boolean;
    categories: {
      starter: Array<{ name: string; description: string; }>;
      mainCourse: Array<{ name: string; description: string; }>;
      desserts: Array<{ name: string; description: string; }>;
    };
  }>;
  feedback: {
    adminEmail: string;
  };
  reviews: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    content: string;
    rating: number;
    date: string;
    status: string;
  }>;
  gallery: Array<{
    id: string;
    name: string;
    description: string;
    date: string;
    photos: string[];
  }>;
  reservation: {
    phoneNumber: string;
    gpayNumber: string;
    contactPerson: string;
  };
}

interface FeedbackData {
  id: string;
  name: string;
  email: string;
  rating: number;
  content: string;
  recommend: string;
  date: string;
}

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);

  // Menu tab state
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [newItem, setNewItem] = useState({ name: '', description: '', category: 'mainCourse' });

  // Gallery tab state
  const [editingAlbum, setEditingAlbum] = useState<any>(null);

  // Password tab state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const contentResponse = await fetch('/data/content.json');
      const content = await contentResponse.json();
      setContentData(content);

      const feedbackResponse = await fetch('/data/feedbacks.json');
      const feedbackData = await feedbackResponse.json();
      setFeedbacks(feedbackData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContentData = async (showReloadMessage: boolean = false) => {
    try {
      // Update content data via API
      const contentResponse = await fetch('http://localhost:3001/api/update-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      // Update feedback data via API
      const feedbackResponse = await fetch('http://localhost:3001/api/update-feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbacks),
      });

      if (contentResponse.ok && feedbackResponse.ok) {
        alert('Content saved successfully! Changes have been applied to the files.');
        // Reload the page to reflect changes
        
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving content! Please make sure the server is running.');
    }
  };

  if (loading || !contentData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const renderHomeTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Home Content</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Summary Text (Max 500 characters)
        </label>
        <textarea
          value={contentData.home.summary}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              setContentData({
                ...contentData,
                home: { ...contentData.home, summary: e.target.value }
              });
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          rows={4}
        />
        <div className="text-sm text-gray-500 mt-1">
          {contentData.home.summary.length}/500 characters
        </div>
      </div>
      <button
        onClick={() => saveContentData()}
        className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 flex items-center space-x-2"
      >
        <Save className="w-4 h-4" />
        <span>Save Changes</span>
      </button>
    </div>
  );

  const renderMenuTab = () => {

    const addMenu = () => {
      const newMenu = {
        id: `menu-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: 'New Menu',
        pricePerPerson: 1000,
        maxPersons: 8,
        childrenAllowed: false,
        categories: {
          starter: [],
          mainCourse: [],
          desserts: []
        }
      };
      setContentData({
        ...contentData,
        menus: [...contentData.menus, newMenu]
      });
      setEditingMenu(newMenu);
    };

    const deleteMenu = (menuId: string) => {
      setContentData({
        ...contentData,
        menus: contentData.menus.filter(menu => menu.id !== menuId)
      });
    };

    const updateMenu = (updatedMenu: any) => {
      setContentData({
        ...contentData,
        menus: contentData.menus.map(menu => 
          menu.id === updatedMenu.id ? updatedMenu : menu
        )
      });
    };

    const addMenuItem = () => {
      if (newItem.name && newItem.description && editingMenu) {
        const updatedMenu = { ...editingMenu };
        updatedMenu.categories[newItem.category as keyof typeof updatedMenu.categories].push({
          name: newItem.name,
          description: newItem.description
        });
        updateMenu(updatedMenu);
        setEditingMenu(updatedMenu);
        setNewItem({ name: '', description: '', category: 'mainCourse' });
      }
    };

    // Function to delete a menu item from a category
    const deleteMenuItem = (category: string, index: number) => {
      if (editingMenu) {
        const updatedMenu = { ...editingMenu };
        updatedMenu.categories[category as keyof typeof updatedMenu.categories].splice(index, 1);
        updateMenu(updatedMenu);
        setEditingMenu(updatedMenu);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Menu Management</h3>
          <button
            onClick={addMenu}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {contentData.menus.map((menu) => (
            <div key={menu.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{menu.title}</h4>
                  <p className="text-gray-600">Date: {menu.date}</p>
                  <p className="text-gray-600">Price: ₹{menu.pricePerPerson} per person</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingMenu(menu)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMenu(menu.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {editingMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Edit Menu</h4>
                <button
                  onClick={() => setEditingMenu(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingMenu.title}
                    onChange={(e) => setEditingMenu({ ...editingMenu, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingMenu.date}
                    onChange={(e) => setEditingMenu({ ...editingMenu, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Person</label>
                  <input
                    type="number"
                    value={editingMenu.pricePerPerson}
                    onChange={(e) => setEditingMenu({ ...editingMenu, pricePerPerson: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Persons</label>
                  <input
                    type="number"
                    value={editingMenu.maxPersons}
                    onChange={(e) => setEditingMenu({ ...editingMenu, maxPersons: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingMenu.childrenAllowed}
                    onChange={(e) => setEditingMenu({ ...editingMenu, childrenAllowed: e.target.checked })}
                    className="mr-2"
                  />
                  Children Allowed
                </label>
              </div>

              <div className="mb-6">
                <h5 className="font-semibold mb-2">Add New Item</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="starter">Starter</option>
                    <option value="mainCourse">Main Course</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>
                <button
                  onClick={addMenuItem}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {Array.isArray(editingMenu.categories.starter) && editingMenu.categories.starter.length > 0 && (<div>
                  <h6 className="font-medium">Starter ({editingMenu.categories.starter.length})</h6>
                  {editingMenu.categories.starter.map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-2 rounded mt-1 flex justify-between items-center">
                      <div>
                        <strong>{item.name}</strong>: {item.description}
                      </div>
                      <button
                        onClick={() => deleteMenuItem('starter', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>)}

                {Array.isArray(editingMenu.categories.mainCourse) && editingMenu.categories.mainCourse.length > 0 && (<div>
                  <h6 className="font-medium">Main Course ({editingMenu.categories.mainCourse.length})</h6>
                  {editingMenu.categories.mainCourse.map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-2 rounded mt-1 flex justify-between items-center">
                      <div>
                        <strong>{item.name}</strong>: {item.description}
                      </div>
                      <button
                        onClick={() => deleteMenuItem('mainCourse', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>)}
                
                {Array.isArray(editingMenu.categories.desserts) && editingMenu.categories.desserts.length > 0 && (<div>
                  <h6 className="font-medium">Desserts ({editingMenu.categories.desserts.length})</h6>
                  {editingMenu.categories.desserts.map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-2 rounded mt-1 flex justify-between items-center">
                      <div>
                        <strong>{item.name}</strong>: {item.description}
                      </div>
                      <button
                        onClick={() => deleteMenuItem('desserts', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>)}
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setEditingMenu(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateMenu(editingMenu);
                    setEditingMenu(null);
                    saveContentData();
                  }}
                  className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700"
                >
                  Save Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFeedbackTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Feedback Settings</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Admin Email Address
        </label>
        <input
          type="email"
          value={contentData.feedback.adminEmail}
          onChange={(e) => setContentData({
            ...contentData,
            feedback: { ...contentData.feedback, adminEmail: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <button
        onClick={() => saveContentData()}
        className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 flex items-center space-x-2"
      >
        <Save className="w-4 h-4" />
        <span>Save Changes</span>
      </button>
    </div>
  );

  const renderReviewsTab = () => {
    const toggleReviewStatus = (reviewId: string) => {
      setContentData({
        ...contentData,
        reviews: contentData.reviews.map(review =>
          review.id === reviewId
            ? { ...review, status: review.status === 'active' ? 'archived' : 'active' }
            : review
        )
      });
    };

    const deleteReview = (reviewId: string) => {
      setContentData({
        ...contentData,
        reviews: contentData.reviews.filter(review => review.id !== reviewId)
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Reviews Management</h3>
          <div className="text-sm text-gray-600">
            Total Reviews: {contentData.reviews.length} | 
            Active: {contentData.reviews.filter(r => r.status === 'active').length} | 
            Archived: {contentData.reviews.filter(r => r.status === 'archived').length}
          </div>
        </div>

        <div className="space-y-4">
          {contentData.reviews.map((review) => (
            <div key={review.id} className={`border rounded-lg p-4 ${review.status === 'archived' ? 'bg-gray-50 opacity-75' : 'bg-white'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold">{review.name}</h4>
                    <span className="text-sm text-gray-500">({review.role})</span>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{review.content}</p>
                  <div className="text-sm text-gray-500">
                    Email: {review.email} | Date: {review.date}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => toggleReviewStatus(review.id)}
                    className={`p-2 rounded ${review.status === 'archived' ? 'text-green-600 hover:text-green-800' : 'text-gray-600 hover:text-gray-800'}`}
                    title={review.status === 'active' ? 'Archive' : 'Restore'}
                  >
                    {review.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Recent Feedback Submissions</h4>
          {feedbacks.length === 0 ? (
            <p className="text-gray-500">No feedback submissions yet.</p>
          ) : (
            feedbacks.map((feedback) => (
              <div key={feedback.id} className="border rounded-lg p-4 bg-blue-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">{feedback.name}</h5>
                    <p className="text-gray-700">{feedback.content}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      Rating: {feedback.rating}/5 | Recommend: {feedback.recommend} | Date: {feedback.date}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => saveContentData()}
          className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    );
  };

  const renderGalleryTab = () => {

    const addAlbum = () => {
      const newAlbum = {
        id: `album-${Date.now()}`,
        name: 'New Album',
        description: '',
        date: new Date().toISOString().split('T')[0],
        photos: []
      };
      setContentData({
        ...contentData,
        gallery: [newAlbum, ...contentData.gallery]
      });
      setEditingAlbum(newAlbum);
    };

    const deleteAlbum = (albumId: string) => {
      setContentData({
        ...contentData,
        gallery: contentData.gallery.filter(album => album.id !== albumId)
      });
    };

    const updateAlbum = (updatedAlbum: any) => {
      setContentData({
        ...contentData,
        gallery: contentData.gallery.map(album => 
          album.id === updatedAlbum.id ? updatedAlbum : album
        )
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Gallery Management</h3>
          <button
            onClick={addAlbum}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Album</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentData.gallery.map((album) => (
            <div key={album.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{album.name}</h4>
                  <p className="text-gray-600 text-sm">{album.date}</p>
                  <p className="text-gray-600 text-sm">{album.photos.length} photos</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingAlbum(album)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAlbum(album.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 text-sm">{album.description}</p>
            </div>
          ))}
        </div>

        {editingAlbum && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Edit Album</h4>
                <button
                  onClick={() => setEditingAlbum(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Album Name</label>
                  <input
                    type="text"
                    value={editingAlbum.name}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingAlbum.date}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingAlbum.description}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photos (comma-separated filenames)</label>
                  <input
                    type="text"
                    value={editingAlbum.photos.join(', ')}
                    onChange={(e) => setEditingAlbum({ 
                      ...editingAlbum, 
                      photos: e.target.value.split(',').map(p => p.trim()).filter(p => p) 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="photo1.jpg, photo2.jpg, photo3.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setEditingAlbum(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateAlbum(editingAlbum);
                    setEditingAlbum(null);
                    saveContentData();
                  }}
                  className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700"
                >
                  Save Album
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPasswordTab = () => {

    const handlePasswordChange = async (e: React.FormEvent) => {
      e.preventDefault();
      setPasswordError('');
      setPasswordSuccess('');

      // Validate current password
      if (currentPassword !== 'admin123') {
        setPasswordError('Current password is incorrect.');
        return;
      }

      // Validate new password
      if (newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters long.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError('New password and confirmation do not match.');
        return;
      }

      try {
        // Create new admin data with updated password
        const newAdminData = {
          password: `$2b$10$${btoa(newPassword).substring(0, 53)}`
        };

        // Update admin data via API
        const response = await fetch('http://localhost:3001/api/update-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAdminData),
        });

        if (response.ok) {
          setPasswordSuccess('Password changed successfully! Please refresh the page to apply changes.');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          throw new Error('Failed to update password');
        }
      } catch (error) {
        console.error('Error changing password:', error);
        setPasswordError('Error changing password. Please make sure the server is running.');
      }
    };

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Change Admin Password</h3>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              minLength={6}
              required
            />
            <p className="text-sm text-gray-500 mt-1">Password must be at least 6 characters long.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {passwordError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">
              {passwordSuccess}
            </div>
          )}

          <button
            type="submit"
            className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        </form>
      </div>
    );
  };

  const renderReservationTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Reservation Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reservation Phone Number
          </label>
          <input
            type="tel"
            value={contentData.reservation.phoneNumber}
            onChange={(e) => setContentData({
              ...contentData,
              reservation: { ...contentData.reservation, phoneNumber: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GPay Number
          </label>
          <input
            type="tel"
            value={contentData.reservation.gpayNumber}
            onChange={(e) => setContentData({
              ...contentData,
              reservation: { ...contentData.reservation, gpayNumber: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Person Name
          </label>
          <input
            type="text"
            value={contentData.reservation.contactPerson}
            onChange={(e) => setContentData({
              ...contentData,
              reservation: { ...contentData.reservation, contactPerson: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>
      <button
        onClick={() => saveContentData()}
        className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 flex items-center space-x-2"
      >
        <Save className="w-4 h-4" />
        <span>Save Changes</span>
      </button>
    </div>
  );

  const tabs = [
    { id: 'home', label: 'Home', icon: <Users className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu', icon: <Calendar className="w-4 h-4" /> },
    { id: 'feedback', label: 'Feedback', icon: <Mail className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Eye className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery', icon: <Image className="w-4 h-4" /> },
    { id: 'reservation', label: 'Reservation', icon: <Phone className="w-4 h-4" /> },
    { id: 'password', label: 'Password', icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-6xl h-5/6 flex relative">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 rounded-l-xl border-r">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
          </div>
          <nav className="p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md mb-2 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
          <div className="absolute bottom-4 left-4">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'home' && renderHomeTab()}
          {activeTab === 'menu' && renderMenuTab()}
          {activeTab === 'feedback' && renderFeedbackTab()}
          {activeTab === 'reviews' && renderReviewsTab()}
          {activeTab === 'gallery' && renderGalleryTab()}
          {activeTab === 'reservation' && renderReservationTab()}
          {activeTab === 'password' && renderPasswordTab()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;