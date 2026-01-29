import { useEffect, useState } from 'react';
import { X, Phone, MapPin, Building2, Download } from "lucide-react";

interface ConfigData {
  basePath: string,
  apiServer: string
}

interface CateringItem {
  id: string;
  mealType: string;
  name: string;
  description: string;
  qty: string;
  qtyUnit: string;
  price: number;
  isActive: boolean;
}

interface CateringNote {
  note: string;
}

interface CateringData {
  description: string;
  mealTypeOrder?: string[];
  menus: CateringItem[];
  notes: CateringNote[];
}

interface CateringDialogProps {
  onClose: () => void;
}

export default function CateringDialog({ onClose }: { onClose: () => void }) {
  const [cateringData, setCateringData] = useState<CateringData | null>(null);
    const [pemphletData, setPemphletData] = useState('');
  const [loading, setLoading] = useState(true);

  // Config data
  const [configData, setConfigData] = useState<ConfigData | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async() => {
    try 
    {
        const response = await fetch('config.json');
        const configData = await response.json();
        setConfigData(configData);

        loadCateringData(configData);
        loadPemphletData(configData);
    } catch (error) {
        console.error('Error loading catering data file: ', error);
    }
  }

  const loadCateringData = async(data: any) => {
    try {
      const contentResponse = await fetch(`${data.apiServer}get-catering`);
      const content = await contentResponse.json();
      if (!content.mealTypeOrder) content.mealTypeOrder = [];
      setCateringData(content);
    } catch (error) {
      console.error('Error loading categring content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPemphletData = async (data: any) => {
    try {
      const response = await fetch(`${data?.apiServer}get-catering-pamphlet`);
      const content = await response.text();
      setPemphletData(content);
    } catch (error) {
      console.error('Error loading catering pemphlet content:', error);
    }
  };

  const generatePamphlet = () => {
    if (!cateringData) return;

    var htmlText = pemphletData;
    var menuItems = "";
    var notes = "";

    if (htmlText.length == 0) {
      alert('Template not found, please contact site administrator.');
    } else {
      if (cateringData.menus && cateringData.menus.length > 0) {
        menuItems = `
          ${orderedMealTypes.map(type => grouped[type] && (
            `<div key={type} class="menu-item-group">
              <h3 class="menu-category-title">
                ${type}
              </h3>

              <div>
                ${grouped[type] && grouped[type].map((item: CateringItem) => (
                  `<div
                    key=${item.id}
                    class="menu-item"
                  >
                    <div>
                      <p class="item-name">${item.name}
                        ${parseFloat(item.qty) > 0 ? `<span class="item-qty">(${item.qty} ${item.qtyUnit})</span>` : ''}
                      </p>
                      ${(item.description && item.description.length > 0) ? `
                      <p class="item-description"><pre class='item-description-pre'>${item.description}</pre></p>` : ''}
                    </div>
                    ${item.price > 0 ? `<div class="item-price">
                      ₹&nbsp;${item.price}
                    </div>` : ''}
                  </div>`
                )).join('')}
              </div>
            </div>`
          )).join('')}`;

        notes = `
            <div>
              <ul>
                ${cateringData.notes.map((n, i) => (
                  `<li key=${i}>${n.note}</li>`
                )).join('')}
              </ul>
            </div>`;
      }

      var catDescription = cateringData.description;

      catDescription = "<pre class='cat-description-pre'>" + catDescription + "</pre>";

      htmlText = htmlText.replaceAll("{{cat_description}}", catDescription);
      htmlText = htmlText.replaceAll("{{cat_menu_items}}", menuItems);
      htmlText = htmlText.replaceAll("{{cat_notes}}", notes);

      //// Create Html File
      const blob = new Blob([htmlText], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BA-Catering-Menu.html`;
      a.click();
      URL.revokeObjectURL(url);
      
      //// Create PDF File
      /*
      // Create a temporary container      
      const temp = document.createElement('div');
      temp.innerHTML = htmlText;

      const options = {
        margin: 0.5,
        filename: `bas-supper-club-${latestMenu.date}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(options).from(temp).save();
      */
    }
  };

  if (!cateringData) return null;

  const grouped = (cateringData.menus || [])
    .filter(item => item.isActive === true)
    .reduce((acc: any, item) => {
      acc[item.mealType] = acc[item.mealType] || [];
      acc[item.mealType].push(item);
      return acc;
    }, {});

  const allMealTypes = Array.from(
    new Set((cateringData.menus || []).filter(item => item.isActive === true).map(m => m.mealType).filter(Boolean))
  );

  const orderedMealTypes = [
    ...(cateringData.mealTypeOrder || []),
    ...allMealTypes.filter(t => !(cateringData.mealTypeOrder || []).includes(t))
  ];


  if (loading || !cateringData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Catering Menu</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 text-gray-800 whitespace-pre-line">
          {cateringData.description}
        </div>

        {/* MENU */}
        <div className="space-y-8">
          {orderedMealTypes.map(type => grouped[type] && (
            <div key={type}>
              <h3 className="text-lg font-semibold text-amber-700 border-b pb-1 mb-3">
                {type}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grouped[type] && grouped[type].map((item: CateringItem) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-top bg-gray-50 border rounded-lg px-4 py-2"
                  >
                    <div>
                      <p className="font-medium">
                        {item.name}
                        {parseFloat(item.qty) > 0 && (<span className="text-sm text-gray-500 mx-2">({item.qty} {item.qtyUnit})</span>)}
                      </p>
                      {item.description && item.description.length > 0 && (
                        <p className='text-sm text-gray-600'>
                          <pre className='item-description-pre'>{item.description}</pre>
                        </p>
                      )}
                    </div>
                    {item.price > 0 && (<div className="font-semibold text-gray-800">
                      ₹{item.price}
                    </div>)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* NOTES */}
        {cateringData.notes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Notes:
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {cateringData.notes.map((n, i) => (
                <li key={i}>{n.note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* DOWNLOAD BUTTON */}
        {Object.keys(grouped).length > 0 && (
          <div className="mt-8 flex justify-end">
            <button 
              onClick={generatePamphlet}
              className="flex items-center inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />&nbsp;
              Download Catering Menu (PDF)
            </button>
          </div>
        )}


        {/* COMPANY INFO */}
        <div className="mt-10 border-t pt-6 grid md:grid-cols-3 gap-4 text-gray-700 text-sm">
          <div className="flex items-center justify-center space-x-2">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>BA’s Supper Club Catering</span>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Jamnagar, Gujarat, India</span>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <Phone className="w-4 h-4 text-amber-600" />
            <span>+91 99741 20608</span>
          </div>
        </div>

      </div>
    </div>
  );
};