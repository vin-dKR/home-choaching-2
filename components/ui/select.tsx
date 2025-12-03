import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    SafeAreaView,
    Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Base item type that the Select component can handle
export interface SelectItem {
    id: number;
    name: string;
}

// Props for the Select component
type SelectProps<T extends SelectItem> = {
    items: T[];
    placeholder?: string;
} & (
        | {
            isMulti?: false;
            selectedItem: T | null;
            onValueChange: (value: T | null) => void;
        }
        | {
            isMulti: true;
            selectedItems: T[];
            onValueChange: (value: T[]) => void;
        }
    );

export function Select<T extends SelectItem>(props: SelectProps<T>) {
    const { items, placeholder = 'Select an item' } = props;
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (item: T) => {
        if (props.isMulti) {
            const { selectedItems, onValueChange } = props;
            const isAlreadySelected = selectedItems.find((i) => i.id === item.id);
            let newSelectedItems;
            if (isAlreadySelected) {
                newSelectedItems = selectedItems.filter((i) => i.id !== item.id);
            } else {
                newSelectedItems = [...selectedItems, item];
            }
            onValueChange(newSelectedItems);
        } else {
            props.onValueChange(item);
            setModalVisible(false);
        }
    };

    const renderLabel = () => {
        if (props.isMulti) {
            if (props.selectedItems.length === 0) return placeholder;
            return props.selectedItems.map((item) => item.name).join(', ');
        } else {
            return props.selectedItem?.name || placeholder;
        }
    };

    const renderItem = ({ item }: { item: T }) => {
        let isSelected = false;
        if (props.isMulti) {
            isSelected = props.selectedItems.some((i) => i.id === item.id);
        } else {
            isSelected = props.selectedItem?.id === item.id;
        }

        return (
            <TouchableOpacity
                onPress={() => handleSelect(item)}
                className="py-4 border-b border-gray-100 flex-row items-center justify-between"
            >
                <Text className="text-base">{item.name}</Text>
                {isSelected && <Ionicons name="checkmark" size={24} color="blue" />}
            </TouchableOpacity>
        );
    };

    return (
        <View className="mb-4">
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="border border-gray-300 rounded-lg p-3 flex-row justify-between items-center bg-white"
            >
                <Text className="text-base text-gray-700">{renderLabel()}</Text>
                <Ionicons name="chevron-down" size={20} color="gray" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-2xl p-5 max-h-[80%]">
                        <View className="flex-row justify-between items-center border-b border-gray-200 pb-2 mb-2">
                            <Text className="text-lg font-bold">{placeholder}</Text>
                            <Button title="Done" onPress={() => setModalVisible(false)} />
                        </View>
                        <FlatList
                            data={items}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
}
