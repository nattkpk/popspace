import { RoomWallpaper } from '@api/roomState/types/common';
import { Spacing, SpacingProps } from '@components/Spacing/Spacing';
import { Box, CircularProgress, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import groupBy from 'lodash/groupBy';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useWallpapers } from './useWallpapers';
import { WallpaperGrid } from './WallpaperGrid';

export interface WallpaperListProps extends SpacingProps {}

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '100%',
  },
  title: {
    marginBottom: theme.spacing(1),
  },
}));

export const WallpaperList: React.FC<WallpaperListProps> = ({ className, ...props }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [wallpapers] = useWallpapers();

  const groupedWallpapers: Record<string, RoomWallpaper[]> = React.useMemo(() => {
    if (!wallpapers) return {};
    return groupBy(wallpapers, (wp: RoomWallpaper) => wp.category);
  }, [wallpapers]);

  if (!wallpapers) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Spacing flexDirection="column" className={clsx(classes.root, className)} {...props}>
      {Object.keys(groupedWallpapers).map((category) => {
        return (
          <div key={category}>
            <Typography variant="h3" className={classes.title}>
              {t(`features.roomSettings.wallpapers.categories.${category}`)}
            </Typography>
            <WallpaperGrid wallpaperList={groupedWallpapers[category]} />
          </div>
        );
      })}
    </Spacing>
  );
};
