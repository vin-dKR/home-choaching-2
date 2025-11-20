import { View, Text, TouchableOpacity } from 'react-native';

const SelectionChip = ({
    items,
    selectedIds,
    onToggle,
    title,
    isMultiSelect
}: SelectionChipProps) => {
    const handlePress = (id: number) => {
        if (isMultiSelect) {
            onToggle((prev: number[]) => {
                // converting null to [] using Nullish coalescing operator 
                const safe = prev ?? [];
                return safe.includes(id)
                    ? safe.filter((i) => i !== id)
                    : [...safe, id];
            })
        } else {
            onToggle(id);
        }
    }

    return (
        <View className='mb-6'>
            <Text className="text-lg font-semibold mb-2">
                {title}
            </Text>

            <View className="flex-row flex-wrap gap-2">
                {items.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        className={`py-2 px-4 rounded-full border 
                            ${selectedIds.includes(item.id) ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
                            }`}
                        onPress={() => handlePress(item.id)}
                    >
                        <Text className={`${selectedIds.includes(item.id) ? 'text-white' : 'text-black'}`}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

export default SelectionChip
