import { useState, useCallback, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import huLocale from '@fullcalendar/core/locales/hu';
import { useStore } from '../../store/useStore';
import { EventDialog } from '../schedule/EventDialog';
import type { ScheduleEvent } from '../../types';

export function CalendarView() {
  const events = useStore((s) => s.events);
  const children = useStore((s) => s.children);

  const isMobile = useMemo(() => window.innerWidth < 768, []);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStart, setDialogStart] = useState<string>();
  const [dialogEnd, setDialogEnd] = useState<string>();
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | undefined>();

  const fcEvents = events.map((e) => {
    const firstChild = children.find((c) => e.childIds.includes(c.id));
    return {
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end,
      backgroundColor: firstChild?.color ?? '#3b82f6',
      borderColor: 'transparent',
      extendedProps: { childIds: e.childIds, notes: e.notes },
    };
  });

  const handleSelect = useCallback((info: DateSelectArg) => {
    setEditingEvent(undefined);
    setDialogStart(info.startStr);
    setDialogEnd(info.endStr);
    setDialogOpen(true);
  }, []);

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      const ev = events.find((e) => e.id === info.event.id);
      if (ev) {
        setEditingEvent(ev);
        setDialogStart(undefined);
        setDialogEnd(undefined);
        setDialogOpen(true);
      }
    },
    [events]
  );

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingEvent(undefined);
    setDialogStart(undefined);
    setDialogEnd(undefined);
  };

  return (
    <div className="flex-1 p-2 sm:p-4 overflow-hidden">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={isMobile ? 'timeGridDay' : 'timeGridWeek'}
        locale={huLocale}
        headerToolbar={
          isMobile
            ? {
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }
            : {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }
        }
        selectable={true}
        selectMirror={true}
        select={handleSelect}
        eventClick={handleEventClick}
        events={fcEvents}
        nowIndicator={true}
        allDaySlot={true}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        height="100%"
        expandRows={true}
        stickyHeaderDates={true}
        dayMaxEvents={isMobile ? 2 : 3}
        eventDisplay="block"
        longPressDelay={300}
      />

      <EventDialog
        open={dialogOpen}
        onClose={closeDialog}
        startDate={dialogStart}
        endDate={dialogEnd}
        event={editingEvent}
      />
    </div>
  );
}
