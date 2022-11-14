import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useEventCallback, useEventListener } from 'usehooks-ts'

type SetValue<T> = Dispatch<SetStateAction<T>>

function parseJSON<T>(value: string | null): T | undefined {
    try {
        return value === 'undefined' ? undefined : JSON.parse(value ?? '')
    } catch {
        console.log('parsing error on', { value })
        return undefined
    }
}

const noopSerializer = <T>(a: T): any  => a;
const noopDeserializer = <T>(a: any): T => a;

export function useLocalStorage<T>(key: string, initialValue: T, serialize?: (a: T) => any, deserialize?: (a: any) => T): [T, SetValue<T>] {
    if (!serialize) serialize = noopSerializer;
    if (!deserialize) deserialize = noopDeserializer;
    // Get from local storage then
    // parse stored json or return initialValue
    const readValue = useCallback((): T => {
        // Prevent build error "window is undefined" but keeps working
        if (typeof window === 'undefined') {
            return initialValue
        }

        try {
            const item = window.localStorage.getItem(key)
            return item ? (deserialize!(parseJSON(item)) as T) : initialValue
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error)
            return initialValue
        }
    }, [initialValue, key])

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(readValue)

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue: SetValue<T> = useEventCallback(value => {
        // Prevent build error "window is undefined" but keeps working
        if (typeof window === 'undefined') {
            console.warn(
                `Tried setting localStorage key “${key}” even though environment is not a client`,
            )
        }

        try {
            // Allow value to be a function so we have the same API as useState
            const newValue = value instanceof Function ? value(storedValue) : value

            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(serialize!(newValue)))

            // Save state
            setStoredValue(newValue)

            // We dispatch a custom event so every useLocalStorage hook are notified
            window.dispatchEvent(new Event('local-storage'))
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error)
        }
    })

    useEffect(() => {
        setStoredValue(readValue())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleStorageChange = useCallback(
        (event: StorageEvent | CustomEvent) => {
            if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
                return
            }
            setStoredValue(readValue())
        },
        [key, readValue],
    )

    // this only works for other documents, not the current one
    useEventListener('storage', handleStorageChange)

    // this is a custom event, triggered in writeValueToLocalStorage
    // See: useLocalStorage()
    useEventListener('local-storage', handleStorageChange)

    return [storedValue, setValue]
}


type LocalStorageValueWithTtl<T> = {
    updatedAt: number,
    value: T,
};

type LocalStorageWithTtlReturn<T> = {
    isPresent: false;
    isOutdated: false;
    value: null;
    updatedAt: number;
    setValue: (newVal: T) => void;
} | {
    isPresent: true;
    isOutdated: boolean;
    value: T;
    updatedAt: number;
    setValue: (newVal: T) => void;
};

export const useLocalStorageWithTtl = <T>(
    key: string,
    ttl: number,
    serialize?: (input: T) => any,
    deserialize?: (input: any) => T
): LocalStorageWithTtlReturn<T> => {
    const setValue = (newVal: T) => {
        const newData = {
            value: newVal,
            updatedAt: Date.now(),
        };
        _setData(newData);
    };

    const localSerializer = (obj: LocalStorageValueWithTtl<T> | null) => {
        if (!obj || !serialize) return obj;
        return {
            ...obj,
            value: serialize(obj.value),
        };
    };

    const localDeserializer = (obj: any): LocalStorageValueWithTtl<T> | null => {
        if (!obj || !deserialize) return obj;
        return {
            updatedAt: obj.updatedAt,
            value: deserialize(obj.value),
        }
    };

    const [data, _setData] = useLocalStorage<LocalStorageValueWithTtl<T> | null>(key, null, localSerializer, localDeserializer);

    return {
        isPresent: data !== null,
        isOutdated: data !== null ? data.updatedAt + ttl < Date.now() : false,
        value: data !== null ? data.value : null,
        updatedAt: data !== null ? data.updatedAt : 0,
        setValue
    } as LocalStorageWithTtlReturn<T>;
};

export const useInterval = (callback: () => void, delay: number) => {
    const savedCallback = useRef<() => void>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => {
            if (savedCallback.current) savedCallback.current();
        };
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
};