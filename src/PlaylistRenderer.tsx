import type { Playlist } from './types'
import { useScaleLayout } from './hooks/useScaleLayout'
import { SectionContainer } from './SectionContainer'
import { ElapsedDisplay } from './ElapsedDisplay'
import { useConfigStore } from './stores/configStore'

export const PlaylistRenderer = ({ playlist, elapsedSinceStart }: { playlist: Playlist, elapsedSinceStart: number }) => {
    const sections = playlist.sections
    const showElapsed = useConfigStore(state => state.config.showElapsed)

    const config = { scaleLayout: true }

    const scale = useScaleLayout(playlist, config.scaleLayout)

    return (
        <>
            {showElapsed && <ElapsedDisplay />}
            <div className='bg-black w-screen h-screen overflow-hidden'>
                {
                    sections.map((section, index) => (
                        <SectionContainer key={index} section={section} scale={scale} elapsedSinceStart={ elapsedSinceStart }/>
                    ))
                }
            </div>
        </>
    )
}
