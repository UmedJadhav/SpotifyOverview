import React, { Component } from 'react';
import { Link }  from 'react-router-dom';

import { get_user_info, logout } from '../../utils/spotify_utils';
import { catch_errors } from '../../utils/utils';

import IconUser from '../icons/user.svg';
import IconInfo from '../icons/info.svg.js';

import Loader from '../Loader/Loader.component.js';
