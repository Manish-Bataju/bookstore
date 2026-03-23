export default function tagSelector({ title, selectedTags = [], categories, multiSelect = true, onChange }) {


    const toggleSelector = (tag) => {
        let updated;

        if (multiSelect) {
            updated = selectedTags.includes(tag) ? selectedTags.filter(c => c !== tag) : [...selectedTags, tag];
        } else {
            updated = selectedTags.includes(tag) ? [] : [tag];
        }

        onChange?.(updated)
    }

    return (
        <div className="mb-4">
            {title &&
                <h3 className="sub-heading font-medium text-black uppercase tracking-widest opacity-70">{title}</h3>}
            <div className="flex gap-1 flex-wrap">
                {categories.map(category => {
                    const isActive = selectedTags.includes(category);
                    return (
                        <span
                            key={category}
                            onClick={() => toggleSelector(category)}
                            className={`cursor-pointer border rounded-md px-2 py-1 shadow-sm
                isActive? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            <span> {category}</span>
                            {isActive && <span className="ml-1.5 opacity-70">✕</span>}
                        </span>
                    )
                })}
            </div>
        </div>
    )
};