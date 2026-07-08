const fs = require('fs');
const file = 'src/app/dashboard/DashboardEditor.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add import
if (!content.includes('import LocalizationEditor')) {
  content = content.replace(
    'import RetreatsEditorForm from "./RetreatsEditorForm";',
    'import RetreatsEditorForm from "./RetreatsEditorForm";\nimport LocalizationEditor from "./LocalizationEditor";'
  );
}

// 2. Fix state initialization for ES content
content = content.replace(
  /const \[esHomeContent, setEsHomeContent\] = useState\(\{.*?\}\);/s,
  "const [esHomeContent, setEsHomeContent] = useState(initialData.content.find(c => c.id === 'home_page_es')?.content || {});"
);
content = content.replace(
  /const \[esTravelContent, setEsTravelContent\] = useState\(\{.*?\}\);/s,
  "const [esTravelContent, setEsTravelContent] = useState(initialData.content.find(c => c.id === 'travel_page_es')?.content || {});"
);
content = content.replace(
  /const \[esRetreatsContent, setEsRetreatsContent\] = useState\(\{.*?\}\);/s,
  "const [esRetreatsContent, setEsRetreatsContent] = useState(initialData.content.find(c => c.id === 'retreats_page_es')?.content || {});"
);

// 3. Fix globalContent initialization
content = content.replace(
  /const \[globalContent, setGlobalContent\] = useState\(\{[\s\S]*?additional_data: \{ email: '', instagram: '', phone: '', facebook: '' \}\n  \}\);/,
  "const [globalContent, setGlobalContent] = useState(initialData.content.find(c => c.id === 'global_settings')?.content || { title: {en:'', es:''}, description: {en:'', es:''}, additional_data: {email:'', phone:'', instagram:''} });"
);

// 4. Update handleSaveTranslations
const newSave = `const handleSaveTranslations = async () => {
    setIsSaving(true);
    try {
      if (localizationTab === "home_page") {
        await saveSiteContent('home_page_es', esHomeContent);
      } else if (localizationTab === "travel_page") {
        await saveSiteContent('travel_page_es', esTravelContent);
      } else if (localizationTab === "retreats_page") {
        await saveSiteContent('retreats_page_es', esRetreatsContent);
      } else if (localizationTab === "information") {
        await saveSiteContent('global_settings', globalContent);
      } else if (localizationTab === "destinations") {
        await saveDestinations(destinations);
      } else if (localizationTab === "reviews") {
        await saveReviews(reviews);
      }
      alert("Translations saved successfully!");
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      alert("Error saving translations: " + error.message);
    }
    setIsSaving(false);
  };`;

content = content.replace(
  /const handleSaveTranslations = async \(\) => \{[\s\S]*?setIsSaving\(false\);\n  \};/,
  newSave
);

// 5. Replace Localization JSX in Main Panel Area
// We need to find:
// {currentMenu === "localization" ? (
//    <div className="flex flex-col h-full bg-gray-50">
//      ...
//    </div>
//  ) : currentMenu === "akses" ? (

const startIndex = content.indexOf('{currentMenu === "localization" ? (');
const endIndex = content.indexOf(') : currentMenu === "akses" ? (', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const jsxToReplace = content.substring(startIndex, endIndex);
  
  const newJsx = `{currentMenu === "localization" ? (
          <LocalizationEditor 
            localizationTab={localizationTab}
            setLocalizationTab={setLocalizationTab}
            homeContent={homeContent}
            esHomeContent={esHomeContent}
            setEsHomeContent={setEsHomeContent}
            travelContent={travelContent}
            esTravelContent={esTravelContent}
            setEsTravelContent={setEsTravelContent}
            retreatsContent={retreatsContent}
            esRetreatsContent={esRetreatsContent}
            setEsRetreatsContent={setEsRetreatsContent}
            globalContent={globalContent}
            setGlobalContent={setGlobalContent}
            destinations={destinations}
            setDestinations={setDestinations}
            reviews={reviews}
            setReviews={setReviews}
            isSaving={isSaving}
            handleSaveTranslations={handleSaveTranslations}
          />
        `;
  
  content = content.replace(jsxToReplace, newJsx);
} else {
  console.log("Could not find the JSX boundaries.");
}

fs.writeFileSync(file, content);
console.log("DashboardEditor.js updated successfully.");
