import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
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
  Lock,
  CalendarDays,
  CalendarClock,
  CookingPot,
  ChefHat,
  Undo2Icon,
  Check,
  Menu
} from 'lucide-react';

type CateringMealType = "Soups" | "Salads" | "Starters" | "Dessert";


interface ConfigData {
  basePath: string,
  apiServer: string
}

interface ContentData {
  home: {
    summary: string;
  };
  menus: Array<{
    id: string;
    mealType: string,
    date: string;
    startTime: string,
    endTime: string,
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

interface CateringData {
    description: string;
    mealTypeOrder?: string[];
    menus: Array<{
      id: string;
      mealType: string,
      name: string;
      description: string;
      qty: number;
      qtyUnit: string;
      price: number;
      isActive: boolean;
    }>;
    notes: Array<{
      note: string;
    }>;
}

interface AdminDashboardProps {
  onClose: () => void;
}

interface EditableDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
}

const EditableDropdown: React.FC<EditableDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder
}) => {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");

  // highlight matched text without filtering
  const highlight = (text: string, match: string) => {
    if (!match) return text;

    const index = text.toLowerCase().indexOf(match.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.substring(0, index)}
        <strong className="font-bold">
          {text.substring(index, index + match.length)}
        </strong>
        {text.substring(index + match.length)}
      </>
    );
  };

  return (
    <div className="relative">
      <input
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
        placeholder={placeholder}
        value={open ? inputText : value}
        onFocus={() => {
          setInputText("");
          setOpen(true);
        }}
        onChange={e => {
          setInputText(e.target.value);
          onChange(e.target.value); // allow free typing
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
          {options.map((opt, i) => (
            <div
              key={i}
              onMouseDown={() => {
                onChange(opt);
                setOpen(false);
                setInputText("");
              }}
              className={`px-3 py-1 cursor-pointer ${
                opt === value
                  ? "bg-amber-200 font-semibold"
                  : "hover:bg-amber-100"
              }`}
            >
              {highlight(opt, inputText)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [cateringData, setCateringData] = useState<CateringData | null>(null);
  const [loading, setLoading] = useState(true);

  // Menu tab state
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [newItem, setNewItem] = useState({ name: '', description: '', category: 'mainCourse' });
  const [editingItem, setEditingItem] = useState<{ item: any; category: string; index: number } | null>(null);

  // Gallery tab state
  const [editingAlbum, setEditingAlbum] = useState<any>(null);

  // Image upload state
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Config data
  const [configData, setConfigData] = useState<ConfigData | null>(null);

  // Password tab state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [editingCateringItem, setEditingCateringItem] = useState<any | null>(null);
  const [showCateringItemModal, setShowCateringItemModal] = useState(false);

  const [cateringForm, setCateringForm] = useState({
    mealType: "",
    name: "",
    description: "",
    qty: 0,
    qtyUnit: "",
    price: "",
    isActive: true
  });
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [draggingMealType, setDraggingMealType] = useState<string | null>(null);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [apiServer, setApiServer] = useState('http://localhost:3001/api/');

  useEffect(() => {
    loadConfigData();
  }, []);

  const init = async() => {
    try {
      const metaApiServer = document.querySelector('meta[name="apiServer"]');
      if (metaApiServer) {
        const apiS = metaApiServer.getAttribute('content');
        if (apiS) {
          setApiServer(apiS);
          console.log("Api Server: ", apiS)
        }
      }

      loadConfigData();
    } catch (error) {
      console.error("Error initializing server:", error);
    } finally {
    }
  };

  const loadConfigData = async() => {
    try {
      const response = await fetch('config.json');
      const data = await response.json();
      setConfigData(data);

      loadData(data);
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const loadData = async (data: any) => {
    try {
      //const contentResponse = await fetch(`${basePath}data/content.json`);
      const contentResponse = await fetch(`${data?.apiServer}get-content`);
      const content = await contentResponse.json();
      setContentData(content);

      //const feedbackResponse = await fetch(`${basePath}data/feedbacks.json`);
      const feedbackResponse = await fetch(`${data?.apiServer}get-feedbacks`);
      const feedbackData = await feedbackResponse.json();
      setFeedbacks(feedbackData);

      const cateringResponse = await fetch(`${data?.apiServer}get-catering`);
      const cateringData = await cateringResponse.json();
      //ensure default order array exists
      if (!cateringData.mealTypeOrder) cateringData.mealTypeOrder = [];
      setCateringData(cateringData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContentData = async (data: any, showReloadMessage: boolean = false) => {
    try {
      // Update content data via API
      const contentResponse = await fetch(configData?.apiServer + 'update-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Update feedback data via API
      const feedbackResponse = await fetch(configData?.apiServer + 'update-feedbacks', {
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

  const saveCateringData = async (data: any, showReloadMessage: boolean = false) => {
    try {
      // Update content data via API
      const cateringResponse = await fetch(configData?.apiServer + 'update-catering', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (cateringResponse.ok) {
        alert('Catering data saved successfully! Changes have been applied to the files.');
      } else {
        throw new Error('Failed to save catering data');
      }
    } catch (error) {
      console.error('Error saving catering data:', error);
      alert('Error saving catering content! Please make sure the server is running.');
    }
  };

  const handleImageUpload = async (albumId: string, files: FileList) => {
    if (!files || files.length === 0) return [];

    setUploadingImages(true);
    const formData = new FormData();
    formData.append('albumId', albumId);
    
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const response = await fetch(configData?.apiServer + 'upload-gallery-images', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        return result.files;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteImage = async (filename: string) => {
    try {
      const response = await fetch(`${configData?.apiServer}delete-gallery-image/${filename}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image. Please try again.');
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

  const getMealTypeDisplay = (text: string) => {
    var txt = "";

    txt = capitalizeEachWord(text) || "";

    return txt;
  }

  const capitalizeEachWord = (text: string) => {
    if (!text) return null;

    const capitalizedWords = text
      .split(' ') // Split the string into an array of words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' '); // Join the words back into a string
    
    return capitalizedWords;
  }

  const renderHomeTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Home Content</h3>
      <hr></hr>
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
        onClick={() => saveContentData(contentData)}
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
        title: '',
        pricePerPerson: 1200,
        maxPersons: 8,
        mealType: 'dinner',
        startTime: '19:00',
        endTime: '22:00',
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
        if (editingItem) {
          // Update existing item
          const updatedMenu = { ...editingMenu };
          updatedMenu.categories[editingItem.category as keyof typeof updatedMenu.categories][editingItem.index] = {
            name: newItem.name,
            description: newItem.description
          };
          updateMenu(updatedMenu);
          setEditingMenu(updatedMenu);
          setNewItem({ name: '', description: '', category: 'mainCourse' });
          setEditingItem(null);
        } else {
          // Add new item
          const updatedMenu = { ...editingMenu };
          updatedMenu.categories[newItem.category as keyof typeof updatedMenu.categories].push({
            name: newItem.name,
            description: newItem.description
          });
          updateMenu(updatedMenu);
          setEditingMenu(updatedMenu);
          setNewItem({ name: '', description: '', category: 'mainCourse' });
        }
      }
    };

    const saveMenu = () => {
      //clone the existing contentData and update changedMenu in it
      var updatedData = structuredClone(contentData);
      for (var i = 0; i < updatedData.menus.length; i++) {
        if (updatedData.menus[i].id === editingMenu.id) {
          updatedData.menus[i] = editingMenu;
          break;
        }
      }

      updateMenu(editingMenu);      //update contentData
      setEditingMenu(null);         //reset editingmenu

      // Save updated data to json file by calling api. Though
      // contentData is updated it will not be reflected until next
      // render, so we have created cloned object and updated it
      // with latest change and use it to save the changes to json
      // file.
      saveContentData(updatedData);
    };
    
    // Function to delete a menu item from a category
    const deleteMenuItem = (category: string, index: number) => {
      if (editingMenu) {
        const updatedMenu = { ...editingMenu };
        updatedMenu.categories[category as keyof typeof updatedMenu.categories].splice(index, 1);
        updateMenu(updatedMenu);
        setEditingMenu(updatedMenu);
        // Reset editing state if we're deleting the item being edited
        if (editingItem && editingItem.category === category && editingItem.index === index) {
          setEditingItem(null);
          setNewItem({ name: '', description: '', category: 'mainCourse' });
        }
      }
    };

    // Function to edit a menu item
    const editMenuItem = (category: string, index: number, item: any) => {
      setEditingItem({ item, category, index });
      setNewItem({
        name: item.name,
        description: item.description,
        category: category
      });
    };

    // Function to cancel editing
    const cancelEdit = () => {
      setEditingItem(null);
      setNewItem({ name: '', description: '', category: 'mainCourse' });
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
                  <p className="text-gray-600">Meal Type: {getMealTypeDisplay(menu.mealType ?? "dinner")} </p>
                  <p className="text-gray-600">Date: {formatDate(menu.date)}&nbsp;&nbsp;&nbsp;{menu.startTime && menu.endTime ? `${menu.startTime} - ${menu.endTime}` : 'Not set'}</p>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min="1"
                    max="20"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Type
                  </label>
                  <select
                    value={editingMenu.mealType || 'dinner'}
                    onChange={(e) => setEditingMenu({ ...editingMenu, mealType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={editingMenu.startTime || ''}
                      onChange={(e) => setEditingMenu({ ...editingMenu, startTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={editingMenu.endTime || ''}
                      onChange={(e) => setEditingMenu({ ...editingMenu, endTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
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
                <h5 className="font-semibold mb-2">{editingItem ? 'Edit Item' : 'Add New Item'}</h5>
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
                    disabled={editingItem !== null}
                  >
                    <option value="starter">Starter</option>
                    <option value="mainCourse">Main Course</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={addMenuItem}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                  {editingItem && (
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {Array.isArray(editingMenu.categories.starter) && editingMenu.categories.starter.length > 0 && (<div>
                  <h6 className="font-medium">Starter ({editingMenu.categories.starter.length})</h6>
                  {editingMenu.categories.starter.map((item: any, index: number) => (
                    <div key={index} className={`p-2 rounded mt-1 flex justify-between items-center ${
                      editingItem && editingItem.category === 'starter' && editingItem.index === index 
                        ? 'bg-blue-100 border border-blue-300' 
                        : 'bg-gray-50'
                    }`}>
                      <div>
                        <strong>{item.name}</strong>: {item.description}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => editMenuItem('starter', index, item)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMenuItem('starter', index)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>)}

                {Array.isArray(editingMenu.categories.mainCourse) && editingMenu.categories.mainCourse.length > 0 && (<div>
                  <h6 className="font-medium">Main Course ({editingMenu.categories.mainCourse.length})</h6>
                  {editingMenu.categories.mainCourse.map((item: any, index: number) => (
                    <div key={index} className={`p-2 rounded mt-1 flex justify-between items-center ${
                      editingItem && editingItem.category === 'mainCourse' && editingItem.index === index 
                        ? 'bg-blue-100 border border-blue-300' 
                        : 'bg-gray-50'
                    }`}>
                      <div>
                        <strong>{item.name}</strong>: {item.description}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => editMenuItem('mainCourse', index, item)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMenuItem('mainCourse', index)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>)}
                
                {Array.isArray(editingMenu.categories.desserts) && editingMenu.categories.desserts.length > 0 && (<div>
                  <h6 className="font-medium">Desserts ({editingMenu.categories.desserts.length})</h6>
                  {editingMenu.categories.desserts.map((item: any, index: number) => (
                    <div key={index} className={`p-2 rounded mt-1 flex justify-between items-center ${
                      editingItem && editingItem.category === 'desserts' && editingItem.index === index 
                        ? 'bg-blue-100 border border-blue-300' 
                        : 'bg-gray-50'
                    }`}>
                      <div>
                        <strong>{item.name}</strong>: {item.description}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => editMenuItem('desserts', index, item)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMenuItem('desserts', index)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>)}
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setEditingMenu(null);
                    setEditingItem(null);
                    setNewItem({ name: '', description: '', category: 'mainCourse' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    saveMenu();
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

  const reorderMealTypes = (fromType: string, toType: string) => {
    if (!cateringData) return;

    // Collect all meal types from menus
    const allMealTypes = Array.from(
      new Set((cateringData.menus || []).map(m => m.mealType).filter(Boolean))
    );

    // Start with saved order + append any missing meal types
    const currentOrder = [
      ...(cateringData.mealTypeOrder || []),
      ...allMealTypes.filter(t => !(cateringData.mealTypeOrder || []).includes(t))
    ];

    const fromIndex = currentOrder.indexOf(fromType);
    const toIndex = currentOrder.indexOf(toType);

    if (fromIndex === -1 || toIndex === -1) return;

    const updatedOrder = [...currentOrder];
    const [moved] = updatedOrder.splice(fromIndex, 1);
    updatedOrder.splice(toIndex, 0, moved);

    const updated = {
      ...cateringData,
      mealTypeOrder: updatedOrder
    };

    setCateringData(updated);
    saveCateringData(updated);
  };

  const reorderCateringItem = (
    mealType: string,
    fromId: string,
    toId: string
  ) => {
    const menus = [...(cateringData?.menus || [])];

    const sameTypeItems = menus.filter(m => m.mealType === mealType);
    const otherItems = menus.filter(m => m.mealType !== mealType);

    const fromIndex = sameTypeItems.findIndex(m => m.id === fromId);
    const toIndex = sameTypeItems.findIndex(m => m.id === toId);

    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = sameTypeItems.splice(fromIndex, 1);
    sameTypeItems.splice(toIndex, 0, moved);

    const updatedMenus = [...otherItems, ...sameTypeItems];

    setCateringData({ ...cateringData!, menus: updatedMenus });
    saveCateringData({ ...cateringData!, menus: updatedMenus });
  };

  const renderCateringTab = () => {
    if (!cateringData) return null;

    // group menus by mealType
    const grouped = (cateringData.menus || []).reduce((acc: any, item: any) => {
      acc[item.mealType] = acc[item.mealType] || [];
      acc[item.mealType].push(item);
      return acc;
    }, {});

    const save = async (data: any) => {
      setCateringData(data);
      await saveCateringData(data);
    };

    const openNew = () => {
      setEditingCateringItem(null);
      setCateringForm({
        mealType: "",
        name: "",
        description: "",
        qty: 0,
        qtyUnit: "",
        price: "",
        isActive: true
      });
      setShowCateringItemModal(true);
    };

    const openEdit = (item: any) => {
      setEditingCateringItem(item);
      setCateringForm({
        mealType: item.mealType,
        name: item.name,
        description: item.description,
        qty: item.qty,
        qtyUnit: item.qtyUnit,
        price: String(item.price),
        isActive: item.isActive
      });
      setShowCateringItemModal(true);
    };

    const saveItem = () => {
      let menus = [...(cateringData.menus || [])];

      if (editingCateringItem) {
        menus = menus.filter(m => m.id !== editingCateringItem.id);
      }

      menus.push({
        id: editingCateringItem?.id || `c-${Date.now()}`,
        mealType: cateringForm.mealType,
        name: cateringForm.name,
        description: cateringForm.description,
        qty: cateringForm.qty,
        qtyUnit: cateringForm.qtyUnit,
        price: Number(cateringForm.price),
        isActive: cateringForm.isActive
      });

      save({ ...cateringData, menus });
      setShowCateringItemModal(false);
    };

    const deleteItem = (id: string) => {
      const menus = (cateringData.menus || []).filter(m => m.id !== id);
      save({ ...cateringData, menus });
    };

    const saveNote = () => {
      const notes = [...cateringData.notes];

      if (editingNoteIndex === null) {
        notes.push({ note: noteText });
      } else {
        notes[editingNoteIndex].note = noteText;
        setEditingNoteIndex(null);
      }

      setNoteText("");
      save({ ...cateringData, notes });
    };

    const deleteNote = (i: number) => {
      const notes = [...cateringData.notes];
      notes.splice(i, 1);
      save({ ...cateringData, notes });
    };

    const existingMealTypes = Array.from(
      new Set((cateringData.menus || []).map(m => m.mealType).filter(Boolean))
    );

    const existingQtyUnits = Array.from(
      new Set((cateringData.menus || []).map(m => m.qtyUnit).filter(Boolean))
    );

    const allMealTypes = Array.from(
      new Set((cateringData?.menus || []).map(m => m.mealType).filter(Boolean))
    );

    const orderedMealTypes = [
      ...(cateringData?.mealTypeOrder || []),
      ...allMealTypes.filter(t => !(cateringData?.mealTypeOrder || []).includes(t))
    ];

    return (
      <div className="space-y-6">

        <h3 className="text-xl font-semibold text-gray-900">Catering Menu</h3>

        <hr></hr>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-lg font-medium">Description</label>
          <textarea
            value={cateringData.description}
            onChange={e => setCateringData({ ...cateringData, description: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <div className="text-xs text-right">
            {(cateringData?.description || "").length} char(s)
          </div>
        </div>

        <hr></hr>

        {/* MENU */}
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Menu Items</h3>
            <button onClick={openNew} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Menu</span>
            </button>
          </div>

          {orderedMealTypes.map(type => (
            <div
              key={type}
              draggable
              onDragStart={() => setDraggingMealType(type)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => {
                if (draggingMealType && draggingMealType !== type) {
                  reorderMealTypes(draggingMealType, type);
                }
                setDraggingMealType(null);
              }}
              className={`mt-4 border rounded p-2 cursor-move ${draggingMealType == type ? "bg-gray-100" : ""}`}>
              <h4 className="flex items-center" title="Drag to reorder entire group">
                <Menu size={18} className="text-gray-400" />
                <span className='px-1 font-bold'>{type}</span>
              </h4>
              {grouped[type].map((m: any) => (
                <div
                  key={m.id}
                  draggable
                  onDragStart={() => setDraggingItemId(m.id)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => {
                    if (draggingItemId && draggingItemId !== m.id) {
                      reorderCateringItem(m.mealType, draggingItemId, m.id);
                    }
                    setDraggingItemId(null);
                  }}
                  className={`flex justify-between py-1 cursor-move border-2 border-transparent ${draggingItemId === m.id ? "bg-amber-100" : ""} hover:border-gray-300 border-dashed`}                  
                  title="Drag to reorder current item">
                  <div className="flex items-center">
                    <Menu size={18} className='text-gray-400' />
                    {m.isActive && (<Check size={18} className='text-green-700'/>)}
                    {!m.isActive && (<X size={18} className='text-red-700'/>)}
                    <span className="px-1">{m.name} ({m.qty} {m.qtyUnit}) - ₹&nbsp;{m.price}</span>
                  </div>
                  <span className="space-x-2">
                    <button onClick={() => openEdit(m)}><Edit size={14} /></button>
                    <button onClick={() => deleteItem(m.id)}><Trash2 size={14} /></button>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <hr></hr>

        {/* NOTES */}
        <div>
          <h3 className="font-semibold text-lg">Notes</h3>
          <ol className="list-decimal ml-4">
            {cateringData.notes.map((n, i) => (
              <li key={i}>
                <div className="flex justify-between border-b py-1">
                  <span>{n.note}</span>
                  <span className="space-x-2">
                    <button onClick={() => { setEditingNoteIndex(i); setNoteText(n.note); }}><Edit size={14} /></button>
                    <button onClick={() => deleteNote(i)}><Trash2 size={14} /></button>
                  </span>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex mt-2">
            <input
              type="text"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Enter note"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"/>

            {editingNoteIndex !== null && (<button
              onClick={() => { setEditingNoteIndex(null); setNoteText("") }}
              className="bg-gray-200 px-4 py-2 rounded-md flex items-center space-x-2 ml-2 hover:bg-gray-300">
              <Undo2Icon className="w-4 h-4" />
              <span>Cancel</span>
            </button>)}
            <button
              onClick={saveNote}
              className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 flex items-center space-x-2 ml-2">
              <Save className="w-4 h-4" />
              <span>{editingNoteIndex === null ? "Add" : "Update"}</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => saveCateringData(cateringData)}
          className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>

        {/* MODAL */}
        {showCateringItemModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Edit Menu</h4>
                <button
                  onClick={() => setShowCateringItemModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                  <EditableDropdown
                    value={cateringForm.mealType}
                    onChange={val => setCateringForm({ ...cateringForm, mealType: val })}
                    options={existingMealTypes}
                    placeholder="Meal Type (e.g. Soups)"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={cateringForm.isActive}
                      onChange={e =>
                        setCateringForm({ ...cateringForm, isActive: e.target.checked })
                      }
                    />
                    <span>Is Active</span>
                  </label>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={cateringForm.name}
                    onChange={e => setCateringForm({ ...cateringForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Item Description (optional)"
                    value={cateringForm.description}
                    onChange={e =>
                      setCateringForm({ ...cateringForm, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    value={cateringForm.qty}
                    onChange={e => setCateringForm({ ...cateringForm, qty: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Unit</label>
                  <EditableDropdown
                    value={cateringForm.qtyUnit}
                    onChange={val =>
                      setCateringForm({ ...cateringForm, qtyUnit: val })
                    }
                    options={existingQtyUnits}
                    placeholder="Quantity Unit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="text"
                    value={cateringForm.price}
                    onChange={e => setCateringForm({ ...cateringForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                    onClick={() => {setShowCateringItemModal(false)}}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    onClick={saveItem}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700">Save
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
      <hr></hr>
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
        onClick={() => saveContentData(contentData)}
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
        <hr></hr>
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
          onClick={() => saveContentData(contentData)}
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
        gallery: contentData.gallery.map(
          album => album.id === updatedAlbum.id ? updatedAlbum : album
        )
      });
    };

    const saveAlbum = () => {
      //clone the existing contentData and update changedAlbum in it
      var updatedData = structuredClone(contentData);
      for (var i = 0; i < updatedData.gallery.length; i++) {
        if (updatedData.gallery[i].id === editingAlbum.id) {
          updatedData.gallery[i] = editingAlbum;
          break;
        }
      }

      updateAlbum(editingAlbum);    //update contentData
      setEditingAlbum(null);        //reset editingAlbum

      // Save updated data to json file by calling api. Though
      // contentData is updated it will not be reflected until next
      // render, so we have created cloned object and updated it
      // with latest change and use it to save the changes to json
      // file.
      saveContentData(updatedData);
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
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setSelectedFiles(e.target.files)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <p className="text-sm text-gray-500 mt-1">Select multiple images to upload (max 5MB each)</p>
                      {selectedFiles && selectedFiles.length > 0 && (
                        <button
                          type="button"
                          onClick={async () => {
                            const uploadedFiles = await handleImageUpload(editingAlbum.id, selectedFiles);
                            if (uploadedFiles.length > 0) {
                              setEditingAlbum({
                                ...editingAlbum,
                                photos: [...editingAlbum.photos, ...uploadedFiles]
                              });
                              setSelectedFiles(null);
                              // Reset the file input
                              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                              if (fileInput) fileInput.value = '';
                            }
                          }}
                          disabled={uploadingImages}
                          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {uploadingImages ? 'Uploading...' : `Upload ${selectedFiles.length} image(s)`}
                        </button>
                      )}
                    </div>

                    {/* Current Images */}
                    {editingAlbum.photos.length > 0 && (
                      <div>
                        <h6 className="font-medium mb-2">Current Images ({editingAlbum.photos.length})</h6>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                          {editingAlbum.photos.map((photo: string, index: number) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                <img
                                  src={`${configData?.basePath}data/uploads/gallery/${photo}`}
                                  alt={`Album photo ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback for images that don't exist
                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5JbWFnZTwvdGV4dD48L3N2Zz4=';
                                  }}
                                />
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newPhotos = [...editingAlbum.photos];
                                    if (index > 0) {
                                      [newPhotos[index], newPhotos[index - 1]] = [newPhotos[index - 1], newPhotos[index]];
                                      setEditingAlbum({ ...editingAlbum, photos: newPhotos });
                                    }
                                  }}
                                  disabled={index === 0}
                                  className="bg-blue-600 text-white p-1 rounded text-xs disabled:opacity-50"
                                  title="Move up"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newPhotos = [...editingAlbum.photos];
                                    if (index < newPhotos.length - 1) {
                                      [newPhotos[index], newPhotos[index + 1]] = [newPhotos[index + 1], newPhotos[index]];
                                      setEditingAlbum({ ...editingAlbum, photos: newPhotos });
                                    }
                                  }}
                                  disabled={index === editingAlbum.photos.length - 1}
                                  className="bg-blue-600 text-white p-1 rounded text-xs disabled:opacity-50"
                                  title="Move down"
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (confirm('Are you sure you want to delete this image?')) {
                                      await handleDeleteImage(photo);
                                      setEditingAlbum({
                                        ...editingAlbum,
                                        photos: editingAlbum.photos.filter((_: string, i: number) => i !== index)
                                      });
                                    }
                                  }}
                                  className="bg-red-600 text-white p-1 rounded text-xs"
                                  title="Delete"
                                >
                                  ×
                                </button>
                              </div>
                              <div className="absolute bottom-1 left-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Manual filename input (fallback) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Or add filenames manually</label>
                      <input
                        type="text"
                        value={editingAlbum.photos.join(', ')}
                        onChange={(e) => setEditingAlbum({ 
                          ...editingAlbum, 
                          photos: e.target.value.split(',').map((p: string) => p.trim()).filter((p: string) => p) 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="photo1.jpg, photo2.jpg, photo3.jpg"
                      />
                    </div>
                  </div>
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
                    saveAlbum();
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
        const response = await fetch(configData?.apiServer + 'update-admin', {
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
        <hr></hr>

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
      <hr></hr>
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
        onClick={() => saveContentData(contentData)}
        className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 flex items-center space-x-2"
      >
        <Save className="w-4 h-4" />
        <span>Save Changes</span>
      </button>
    </div>
  );

  const formatDate = (date: string) => {
    var formattedDate = format(new Date(date), 'EEE, dd-MMM-yyyy');

    return formattedDate;
  };

  // Get latest menu
  const sortedMenus = contentData.menus
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const tabs = [
    { id: 'home', label: 'Home', icon: <Users className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu', icon: <CookingPot className="w-4 h-4" /> },
    { id: 'catering', label: 'Catering', icon: <ChefHat className="w-4 h-4" /> },
    { id: 'feedback', label: 'Feedback', icon: <Mail className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Eye className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery', icon: <Image className="w-4 h-4" /> },
    { id: 'reservation', label: 'Reservation', icon: <Phone className="w-4 h-4" /> },
    { id: 'password', label: 'Password', icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full h-[100dvh] md:h-5/6 md:max-w-6xl md:rounded-xl relative overflow-hidden flex flex-col">

        {/* ===== Mobile Header ===== */}
        <div className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b bg-white">
          <button onClick={() => setIsSidebarOpen(true)}>☰</button>
          <h2 className="font-semibold text-lg">Admin Dashboard</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* ===== Sidebar Overlay (Mobile) ===== */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex flex-1 relative min-h-0">

          {/* ===== Sidebar ===== */}
          <div
            className={`
              fixed md:static z-50 md:z-auto
              top-0 left-0 h-full
              w-64 bg-gray-50 border-r
              transform transition-transform duration-300
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              md:translate-x-0
            `}
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
            </div>

            <nav className="p-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false); // 👈 auto-close on mobile
                  }}
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

          {/* ===== Main Content ===== */}
          <div className="flex-1 min-h-0 p-4 md:p-6 overflow-y-auto mt-12 md:mt-0">
            {activeTab === 'home' && renderHomeTab()}
            {activeTab === 'menu' && renderMenuTab()}
            {activeTab === 'catering' && renderCateringTab()}
            {activeTab === 'feedback' && renderFeedbackTab()}
            {activeTab === 'reviews' && renderReviewsTab()}
            {activeTab === 'gallery' && renderGalleryTab()}
            {activeTab === 'reservation' && renderReservationTab()}
            {activeTab === 'password' && renderPasswordTab()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;