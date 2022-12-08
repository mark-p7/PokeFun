import React, { useEffect, useState, useContext }from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import PokeLogo from '../assets/PokeLogo.png';
import Icon from '@mui/material/Icon';
import CardMedia from '@mui/material/CardMedia';
import { Outlet, Link, redirect } from "react-router-dom";
import { Context } from '../context/userContext';

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { userStatus, setUserStatus } = useContext(Context)
  const [pages, setPages] = useState(['home', 'register', 'login', 'logout']);
  useEffect(() => {
    // console.log('User Change')
    // console.log(userStatus);
    // console.log(userStatus.isAdmin && pages.length == 4)
    // console.log(userStatus.isAdmin && pages.length == 5)

    if (userStatus.isAdmin && pages.length == 4) {
      setPages([...pages, 'admin'])
    }
    if (!userStatus.isAdmin && pages.length == 5) {
      setPages(pages.slice(0, 4))
    }
    // console.log(pages)
  }, [userStatus]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PokeAPI
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <CardMedia
                component="img"
                height="40"
                image={PokeLogo}
                alt="PokeLogo"
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link to={`${page}`}><Typography textAlign="center">{page}</Typography></Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PokeAPI
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link key={page} to={`${page}`} style={{ textDecoration: 'none', margin: '10px' }}>
                <Button
                  variant='outlined'
                  onClick={handleCloseNavMenu}
                  sx={{ color: 'white', display: 'block', textDecoration: 'none' }}
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {userStatus.loggedIn ? userStatus.isAdmin ? (<i>Admin Logged in</i>) : (<i>User Logged in</i>) : (<i>Logged out</i>)}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;