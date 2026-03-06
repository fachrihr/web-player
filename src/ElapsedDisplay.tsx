import { useEffect, useState } from 'react'

const PAGE_LOAD_TIME = performance.now()

export const ElapsedDisplay = () => {
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        const id = setInterval(() => {
            setElapsed(Math.floor((performance.now() - PAGE_LOAD_TIME) / 1000))
        }, 1000)

        return () => clearInterval(id)
    }, [])

    return (
        <div className="fixed top-2 right-2 bg-black text-green-400 text-sm font-mono px-2 py-1 rounded shadow-md z-50">
            Elapsed: {elapsed} sec
        </div>
    )
}